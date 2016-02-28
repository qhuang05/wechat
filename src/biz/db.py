#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'bac'

__doc__ = """

"""


from sqlalchemy import create_engine
from sqlalchemy import exc
from sqlalchemy import event
from sqlalchemy.pool import Pool

from threading import Semaphore
from jinja2 import Template
import traceback
import struct
from pymysql.constants import FIELD_TYPE
from pymysql.converters import conversions


# 解决pymysql没有把mysql中的bit转成bool的问题
conversions[FIELD_TYPE.BIT] = lambda b: struct.unpack(">Q", ("\x00" * (8 - len(b)) + b))[0]


engine = None

db_semaphore = Semaphore()


# application.py中初始化此配置
def configure_db(app):
    """
    初始化数据库相关资源
    :param app:
    :return:
    """
    global engine
    if not engine:
        db_semaphore.acquire()
        if not engine:
            connstr = 'mysql+pymysql://%s:%s@%s:%d/%s' % (
                app.config.get('MYSQL_USER', ''),
                app.config.get('MYSQL_PASS', ''),
                app.config.get('MYSQL_HOST', ''),
                int(app.config.get('MYSQL_PORT', 3306)),
                app.config.get('MYSQL_DB', ''),
            )
            print '连接字符串:' + connstr
            engine = _create_app_engine(connstr)
        db_semaphore.release()


def _create_app_engine(connstr):
    """
    engine连接池相关的参数:
    -pool_recycle, 默认为-1, 推荐设置为7200, 即如果connection空闲了7200秒, 
        自动重新获取, 以防止connection被db server关闭
    -pool_size=5, 连接数大小，默认为5，正式环境该数值太小，需根据实际情况
        调大
    -max_overflow=10, 超出pool_size后可允许的最大连接数，默认为10, 这10个
        连接在使用过后, 不放在pool中, 而是被真正关闭的
    -pool_timeout=30, 获取连接的超时阈值, 默认为30秒
    """
    return create_engine(
        connstr,
        connect_args={'charset': 'utf8'},
        pool_recycle=7200,
        pool_size=20,
        pool_timeout=30,
        max_overflow=10,
    )


@event.listens_for(Pool, "checkout")
def _ping_connection(dbapi_connection, connection_record, connection_proxy):
    cursor = dbapi_connection.cursor()
    try:
        cursor.execute("SELECT 1")
    except:
        # optional - dispose the whole pool
        # instead of invalidating one at a time
        # connection_proxy._pool.dispose()

        # raise DisconnectionError - pool will try
        # connecting again up to three times before raising.
        raise exc.DisconnectionError()
    cursor.close()


class DB():


    def __init__(self, session=None,logger=None):
        """
        传入session时整个db对象使用同一session操作
        """
        global engine
        self.engine = engine
        self.session = session
        self.logger = logger

    def execute(self, sql, session=None, **kwargs):

        # 判断是否有缓存的Template对象,如果有就直接使用,省去解析模板的时间
        cache_key = "template_" + sql
        if hasattr(self, cache_key):
            sql_template = getattr(self, cache_key)
        else:
            sql_template = Template(sql)
            setattr(self, cache_key, sql_template)

        temp_sql = sql_template.render(**kwargs)

        # execute时可以传入外部session，那么当前execute则使用传入的session
        tmp_session = None
        if session:
            tmp_session = session
        else:
            tmp_session = self.session

        # 用于输出日志
        log_string = "执行SQL:%s \n 参数: %s" % (temp_sql, kwargs)

        try:
            # 执行sql
            # 如果有通过DB实例或者execute传入session，则使用session
            # 否则从连接池中分配一个连接进行操作
            if tmp_session:
                pars = dict(**kwargs)
                self.result = tmp_session.execute(temp_sql, params=pars)
            else:
                self.result = engine.execute(temp_sql, **kwargs)
        except Exception, e:
            log_string += "\n执行结果:\n 执行失败了 ,错误信息:" + str(e)
            self.logger.error(log_string)
            raise Exception(traceback.format_exc())

        # 受影响行数
        self.rowcount = self.result.rowcount
        # 插入数据时返回的主键数据
        self.lastrowid = self.result.lastrowid

        log_string += "\n执行结果:\n 受影响行数:%d" % self.rowcount
        self.logger.debug(log_string)

        return self

    def all(self):
        # 获取查询列表。把ResultProxy和RowProxy类型封装成python的list和dict类型
        data = [dict(zip(i.keys(), i.values())) for i in self.result]
        self.result.close()
        return data

    def first(self):
        row = None
        # 获取第一行数据
        for i in self.result:
            row = dict(zip(i.keys(), i.values()))
            break
        self.result.close()
        return row

    def one(self):
        """获取第一行第一列的数据"""
        one = None
        for i in self.result:
            res = i.values()
            one = res[0]
            break
        self.result.close()
        return one





