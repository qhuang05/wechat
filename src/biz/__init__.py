#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
    当前模块包含了能实现配置声明式事务的逻辑基类(class Biz)
    它配合一个装饰器(@transaction)来实现声明式事务
    在继承了Biz的类的方法上使用上述装饰器,并且所有数据库的相关操作都要通过基类的get_db_session方法来获取数据库回话对象
"""

__author__ = 'bac'

import traceback
import threading
from sqlalchemy.orm import sessionmaker
from flask import current_app
import db


class Biz(object):
    """
        业务逻辑基类
    """

    def __init__(self, logger=None):
        if logger:
            self.logger = logger

    def get_session(self):
        """获取数据库回话对象"""
        return _get_session()

    @classmethod
    def get_db_session(self):
        return _get_session()

    def _get_logger(self):
        if hasattr(self, 'logger'):
            return self.logger
        else:
            import sys
            if '--scheduleMode' in sys.argv:
                import logging
                return logging.getLogger()
            else:
                return current_app.logger

    def get_db(self):
        return db.DB(self.get_session(), self._get_logger())

    def executeSql(self, sql, session=None, **kwargs):
        if session:
            dbInstance = db.DB(session, self._get_logger())
        else:
            dbInstance = self.get_db()
        return dbInstance.execute(sql, session=session, **kwargs)


class PROPAGATION:
    """
        事务的传播级别
        REQUIRES_NEW    # 需要事务,而且必须是新事务
        REQUIRED       # 需要事务,如果有就直接用,没有就创建一个
        SUPPORTS        # 支持事务,如果有事务就用,没有就不用
        NOT_SUPPORTED   # 不支持事务
    """

    def __init__(self):
        pass

    REQUIRED = 0  # 需要事务,如果有就直接用,没有就创建一个
    SUPPORTS = 1  # 支持事务,如果有事务就用,没有就不用
    REQUIRES_NEW = 2  # 需要事务,而且必须是新事务
    NOT_SUPPORTED = 3  # 不支持事务


def transaction(propagation=PROPAGATION.REQUIRED):
    """
        用来开启事务
        propagation:事务传播级别,有一下几个级别
        PROPAGATION.REQUIRES_NEW    # 需要事务,而且必须是新事务
        PROPAGATION.REQUIRED        # 需要事务,如果有就直接用,没有就创建一个
        PROPAGATION.SUPPORTS        # 支持事务,如果有事务就用,没有就不用
        PROPAGATION.NOT_SUPPORTED   # 不支持事务
    """

    def deco_deco(func):
        def deco(*args, **kwargs):

            # 创建事务
            sessionjar = _SessionJar(propagation)

            # 开始事务
            sessionjar.begin()
            result = None
            try:
                result = func(*args, **kwargs)

                # 提交事务
                sessionjar.commit()
            except Exception, e:
                # 回滚事务
                sessionjar.rollback()
                error = traceback.format_exc()
                raise Exception(error)

            return result

        return deco

    return deco_deco


class _SessionJar:
    """
        用来表示当前事务,
        其中包含了数据库回话对象
    """

    def __init__(self, propagation=PROPAGATION.REQUIRED):
        """
            propagation:事务传播级别,有一下几个级别
            PROPAGATION.REQUIRES_NEW    # 需要事务,而且必须是新事务
            PROPAGATION.REQUIRED        # 需要事务,如果有就直接用,没有就创建一个
            PROPAGATION.SUPPORTS        # 支持事务,如果有事务就用,没有就不用
            PROPAGATION.NOT_SUPPORTED   # 不支持事务
        """

        auto_commit = False
        need_commit = False

        # 需要开启新事务
        if propagation == PROPAGATION.REQUIRES_NEW:
            session = _create_session(False)
            need_commit = True

        # 需要事务,如果前面有事务就用,没有就创建新的
        elif propagation == PROPAGATION.REQUIRED:
            session = _get_session_from_jars(True)
            if not session:
                session = _create_session(False)
                need_commit = True

        # 支持事务,如果前面有事务就用,没有就不用
        elif propagation == PROPAGATION.SUPPORTS:
            session = _get_session_from_jars(True)

            if not session:
                session = _get_session_from_jars(False)
                auto_commit = True

            if not session:
                session = _create_session(True)
                auto_commit = True

        # 不支持事务
        elif propagation == PROPAGATION.NOT_SUPPORTED:
            session = _get_session_from_jars(False)
            if not session:
                session = _create_session(True)
                auto_commit = True
        else:
            raise Exception("无效的propagation=%d" % propagation)

        self.autoCommit = auto_commit
        self.session = session
        self.needCommit = need_commit

    def begin(self):
        """
            开始事务
        """
        _save_sessionjar(self)

    def rollback(self):
        """
            回滚事务
        """
        if self.needCommit and not self.autoCommit:
            self.session.rollback()
            self.session.close()

        _remove_sessionjar(self)

    def commit(self):
        """
            提交事务
        """
        if self.needCommit and not self.autoCommit:
            self.session.commit()
            self.session.close()

        _remove_sessionjar(self)


# 线程相关对象
threadLocal = threading.local()


def _create_session(auto_commit):
    """创建数据库回话对象
    auto_commit:是否自动提交(如果需要事务:Flase,如果不需要事务:True)
    """
    maker = sessionmaker(bind=db.engine, autocommit=auto_commit)
    return maker()


def _save_sessionjar(sessionjar):
    """
        将事务放入事务栈的最后,用于开始进程
    """
    if not hasattr(threadLocal, "sessions"):
        threadLocal.sessions = []
    threadLocal.sessions.append(sessionjar)


def _remove_sessionjar(sessionjar):
    """
        从当前事务栈中移除一个事务
    """
    threadLocal.sessions.pop()


def _get_session_from_jars(tran=True):
    """
        从事务栈中获取最近的数据库回话对象(从后向前查找)
        tran:是否查找开启了事务的回话对象
    """
    if not hasattr(threadLocal, "sessions"):
        return None

    for sessionJar in threadLocal.sessions[::-1]:
        if sessionJar.autoCommit != tran:
            return sessionJar.session


def _get_session():
    """ 获取数据库回话对象
        如果当前存在事务,则使用最后一个事务的回话对象
        否则,新建一个
    """

    if hasattr(threadLocal, "sessions") and len(threadLocal.sessions) > 0:
        return threadLocal.sessions[-1].session
    return _create_session(True)
