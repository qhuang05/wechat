# -*- coding: utf-8 -*-
# !/usr/bin/python


import os
import pymysql
from flask import Flask, g, json
from flask_login import LoginManager
from src.biz import db
from src import web
from src import LoggedUser
from src.api.delivery import view as delivery
from src.web.system import view as system
from src.web.orders import view as orders
from src.web.customer import view as customer
from src.web.information import view as information
from src.web.activity import view as activity
from src.web.level import view as level
from src.web.dataQuery import view as dataQuery
from src.web.unit import view as unit
from src.web.Article import view as article
from src.web.Client import view as client
from src.web.medal import medal as backstagemedal
from src.wechat import view as weixin
from src.wechat.index import view as index
from src.wechat.mall import view as mall
from src.wechat.mine import view as mine
from src.wechat.mine import medal
from src.spread import view as spread

PROJECT_PATH = os.path.dirname(__file__)

login_manager = LoginManager()

def create_app():
    app = Flask(__name__)

    config_file = os.path.abspath(os.path.join(PROJECT_PATH, 'etc/config.py'))
    app.config.from_pyfile(config_file)

    config_log(app)
    config_db(app)
    config_route(app)


    app.logger.warn("app准备好了")

    login_manager.init_app(app)


    @login_manager.user_loader
    def load_user(userid):
        return LoggedUser(int(userid))

    return app


def config_log(app):
    import logging
    from logging.handlers import RotatingFileHandler

    format = '[%(asctime)s %(levelname)s]: %(message)s [in %(pathname)s:%(lineno)d]'
    log_file = app.config.get("LOG_FILE")
    if log_file:
        handler = RotatingFileHandler(
            log_file,
            maxBytes=10000,
            backupCount=10,
        )
        handler.setFormatter(logging.Formatter(format))
        app.logger.addHandler(handler)

    debug = app.debug
    if not debug:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(format))
        app.logger.addHandler(handler)
        app.logger.setLevel(logging.WARN)

    app.logger.warn("xxxx")

def config_db(app):
    """
    配置数据
    :param app:
    :return:
    """
    db.configure_db(app)

    @app.before_request
    def before_request():
        g.db = pymysql.connect(host=app.config.get("MYSQL_HOST"), user=app.config.get("MYSQL_USER"),
                               passwd=app.config.get("MYSQL_PASS"), db=app.config.get("MYSQL_DB"),
                               port=int(app.config.get("MYSQL_PORT")))

    @app.teardown_request
    def teardown_request(exception):
        if hasattr(g, 'db'):
            g.db.close()


def config_route(app):
    """
    配置 url
    :param app:
    :return:
    """
    common_prefix = '/4test' if app.debug and app.config["WEIXIN_DEBUG"] else ''

    app.register_blueprint(web.bp, url_prefix=common_prefix)
    app.register_blueprint(weixin.bp, url_prefix=common_prefix)
    app.register_blueprint(delivery.bp, url_prefix="/api/delivery")
    app.register_blueprint(system.bp, url_prefix=common_prefix)
    app.register_blueprint(orders.bp)
    app.register_blueprint(customer.bp, url_prefix=common_prefix)
    app.register_blueprint(dataQuery.bp, url_prefix=common_prefix)
    app.register_blueprint(activity.bp, url_prefix=common_prefix)
    app.register_blueprint(level.bp, url_prefix=common_prefix)
    app.register_blueprint(information.bp, url_prefix=common_prefix)
    app.register_blueprint(unit.bp, url_prefix=common_prefix)
    app.register_blueprint(spread.bp, url_prefix=common_prefix)
    app.register_blueprint(article.bp, url_prefix=common_prefix)
    app.register_blueprint(client.bp, url_prefix=common_prefix)
    app.register_blueprint(mall.bp, url_prefix=common_prefix)
    app.register_blueprint(index.bp, url_prefix=common_prefix)
    app.register_blueprint(mine.bp, url_prefix=common_prefix)
    app.register_blueprint(medal.bp, url_prefix=common_prefix)
    app.register_blueprint(backstagemedal.bp, url_prefix=common_prefix)

    @app.errorhandler(400)
    def handler_400(error):
        return json.dumps(dict(message='参数不能为空:' + str(error.args))), 400




