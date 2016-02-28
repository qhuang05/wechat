#!/usr/bin/env python
# -*- coding: utf-8 -*-

from ..tools import JSON
from flask import Response, request

__author__ = 'Bac'


def error_json(code, message, **kwargs):
    """
    返回错误提示(JSON格式):{"message":"错误信息"}
    :param code:
    :param message:
    :return:
    """
    msg = dict(kwargs)
    msg["message"] = message
    return Response(response=JSON.dumps(msg), status=code, mimetype="application/json")


def success_json(**kwargs):
    """
    返回JSON数据
    :param args:
    :param kwargs:
    :return:
    """
    return Response(response=JSON.dumps(kwargs), status=200, mimetype="application/json")

def get_login_user_id():
    return request.headers["X-User-Id"]