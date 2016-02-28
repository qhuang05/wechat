#!/usr/bin/env python
# -*- coding: utf-8 -*-

import datetime
import decimal

from flask import json


__author__ = 'Vian'


class MyEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            if obj.utcoffset() is not None:
                obj = obj - obj.utcoffset()
            encoded_object = obj.strftime('%Y-%m-%d %H:%M:%S.%f')
        elif isinstance(obj, datetime.date):
            encoded_object = obj.strftime('%Y-%m-%d')
        elif isinstance(obj, decimal.Decimal):
            encoded_object = float(obj)
        else:
            encoded_object = json.JSONEncoder.default(self, obj)
        return encoded_object


def dumps(obj):
    return json.dumps(obj, cls=MyEncoder)


def loads(str):
    """

    :rtype : object
    """
    return json.loads(str, encoding="utf-8")