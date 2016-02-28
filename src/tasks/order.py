#!/usr/bin/env python
# -*- coding: utf-8 -*-


import time , datetime
from ..biz import Biz
from .import timing

__author__ = 'McGee'

class Order(Biz):
    def __init__(self, logger):
        super(Order, self).__init__(logger)

    def check(self):
        now_time = datetime.datetime.now()

        tomorrow_time = str(datetime.datetime.strftime(now_time, '%H%M'))

        if tomorrow_time =='1600':
            biz = timing()
            msg = biz.timingbydeliveryOrder(1)
            return msg
        elif tomorrow_time =='1630':
            biz = timing()
            msg = biz.timingbydeliveryOrder(2)
            return msg
        elif tomorrow_time =='1700':
            biz = timing()
            msg = biz.timingbydeliveryOrder(3)
            return msg
        elif tomorrow_time =='1730':
            biz = timing()
            msg = biz.timingbydeliveryOrder(4)
            return msg
        elif tomorrow_time =='1800':
            biz = timing()
            msg = biz.timingbydeliveryOrder(5)
            return msg
        elif tomorrow_time =='1830':
            biz = timing()
            msg = biz.timingbydeliveryOrder(6)
            return msg
        elif tomorrow_time =='1900':
            biz = timing()
            msg = biz.timingbydeliveryOrder(7)
            return msg
        elif tomorrow_time =='1930':
            biz = timing()
            msg = biz.timingbydeliveryOrder(8)
            return msg
        elif tomorrow_time =='2000':
            biz = timing()
            msg = biz.timingbydeliveryOrder(9)
            return msg
        elif tomorrow_time =='2030':
            biz = timing()
            msg = biz.timingbydeliveryOrder(10)
            return msg
        elif tomorrow_time =='2100':
            biz = timing()
            msg = biz.timingbydeliveryOrder(11)
            return msg
        elif tomorrow_time =='2130':
            biz = timing()
            msg = biz.timingbydeliveryOrder(12)
            return msg
        elif tomorrow_time =='2200':
            biz = timing()
            msg = biz.timingbydeliveryOrder(13)
            return msg
        elif tomorrow_time =='2230':
            biz = timing()
            msg = biz.timingbydeliveryOrder(14)
            return msg
        elif tomorrow_time =='2300':
            biz = timing()
            msg = biz.timingbydeliveryOrder(15)
            return msg
        elif tomorrow_time =='2330':
            biz = timing()
            msg = biz.timingbydeliveryOrder(16)
            return msg
        else:
            return 'end'


        # return self.executeSql('select * from BO_Orders limit 1')