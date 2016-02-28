#!/usr/bin/env python
# -*- coding: utf-8 -*-

from src import biz


__author__ = 'McGee'


class medalifterface(biz.Biz):
    """
    勋章条件查询接口
    """
    def __init__(self):
        return


    def medal_single(self, clientid):
        """
        单品消费
        @:param clientid   客户ID
        @:return
        """

        return

    def medal_mproducts(self, clientid):
        """
        多品消费
        @:param clientid   客户ID
        @:return
        """
        return

    def medal_consumerno(self, clientid):
        """
        消费瓶数
        @:param clientid   客户ID
        @:return
        """
        return

    def medal_integral(self, clientid):
        """
        消费积分
        @:param clientid   客户ID
        @:return
        """
        return

    def medal_frequency(self, clientid):
        """
        消费频次
        @:param clientid   客户ID
        @:return
        """
        return

    def medal_sign(self, clientid):
        """
        签到
        @:param clientid   客户ID
        @:return
        """
        return