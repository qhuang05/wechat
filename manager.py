#!/usr/bin/env python
# -*- coding: utf-8 -*-

from application import create_app

__author__ = 'bac'

app = create_app()

if __name__ == '__main__':
    app.run(host="0.0.0.0",port=5008)
