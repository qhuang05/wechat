#!/usr/bin/env python
# -*- coding: utf-8 -*-


from ..biz import Biz
from src.wechat import location
from src.web.customer import customer
from src.web.orders import orderList
from src.api.delivery import DeliveryBiz
from src.wechat.shopping import netstore

__author__ = 'McGee'

# 查询带配送订单
sql_select_by_order_timing_delivery="""
SELECT ID AS orderid, ORDER_LONGITUDE AS longitude, ORDER_LATITUDE AS latitude FROM BO_Orders WHERE APPTIME_ID=:timecode AND ORDER_STATUS='01' AND IS_EFFECT='0'
AND (ISPUSH='0' OR ISPUSH IS NULL)
"""

# 查询配送站坐标
sql_select_by_order_timing_ship_location="""
SELECT ID AS shipid, SHIP_LONGITUDE AS lon, SHIP_LATITUDE AS lat FROM BM_Ship WHERE IS_EFFECT='0'
"""

# 配送站坐标距离插入
sql_insert_by_order_timing_coordinate="""
INSERT INTO BM_Delivery_Coordinate(ORDERID, DISTANCE, CREATE_TIME, SHIPID) VALUES (:orderid, :distance, NOW(), :shipid)
"""

# 查询最短距离配送站
sql_select_by_timing_min_ship="""
SELECT SHIPID FROM BM_Delivery_Coordinate WHERE DISTANCE=(select MIN(DISTANCE) FROM BM_Delivery_Coordinate WHERE ORDERID=:orderid) AND ORDERID=:orderid
"""

# 预配送状态修改
sql_update_by_order_timing_delivery="""
UPDATE BO_Orders SET ORDER_STATUS=:orderstatus WHERE id=:orderid
"""

# 更新定订单配送时间
sql_update_by_ordertime_timing_delivery="""
UPDATE BO_Orders SET ORDER_TIME=DATE_ADD(NOW(),INTERVAL 20 MINUTE) WHERE ID=:orderid AND IS_EFFECT='0'
"""

#查看订单是否已完成配送
sql_select_by_order_carry_out="""
SELECT COUNT(1) FROM BO_Orders WHERE ORDER_STATUS!=:orderstatus AND ID=:orderid
"""

#已推送状态修改
sql_update_by_order_yes_ispush="""
UPDATE BO_Orders SET ISPUSH='1' WHERE ID=:orderid
"""

#推送失败
sql_update_by_order_no_ispush="""
UPDATE BO_Orders SET ISPUSH='0' WHERE ID=:orderid
"""

class timing(Biz):

    def __init__(self):
        return


    def timingbydeliveryOrder(self, timecode):
        """
        定时配送订单
        @:param  时间字典
        @:return
        """
        try:
            biz = location()
            bia = netstore()
            deliverItem = customer()
            order = orderList()
            orderSendItem = DeliveryBiz()

            orderitem = self.executeSql(sql_select_by_order_timing_delivery, timecode=timecode).all()

            msg="None"


            for rows in orderitem:
                orderid=rows['orderid']
                longitude =rows['longitude']
                latitude = rows['latitude']

                ordercount = self.executeSql(sql_select_by_order_carry_out, orderstatus='01', orderid=orderid).one()

                if ordercount==0:
                    shipitem = self.executeSql(sql_select_by_order_timing_ship_location).all()    #查询配送站坐标
                    for shiprows in shipitem:
                        shipid = shiprows['shipid']
                        lon = shiprows['lon']
                        lat = shiprows['lat']
                        distance=biz.bd_routematrix(str(longitude), str(latitude), str(lon), str(lat))
                        self.executeSql(sql_insert_by_order_timing_coordinate, orderid=orderid, distance=distance, shipid=shipid)

                    shipid = self.executeSql(sql_select_by_timing_min_ship, orderid=orderid).one()

                    deliverId = deliverItem.order_deliver_id(shipid)
                    deliverItem.order_deliver_ordersNumber(deliverId)
                    status = order.add_ordersend(deliverId, orderid)
                    self.executeSql(sql_update_by_ordertime_timing_delivery, orderid=orderid)
                    """订单推送状态修改"""
                    self.executeSql(sql_update_by_order_yes_ispush, orderid=orderid)

                    res,msg = orderSendItem.push_new_order_message(deliverId, '您有一个新的配送订单！', orderid)

                    if res==True:
                        self.executeSql(sql_update_by_order_timing_delivery, orderstatus='02', orderid=orderid)
                        msg = 'Success'
                    else:
                        """订单推送（失败）状态修改"""
                        self.executeSql(sql_update_by_order_no_ispush, orderid=orderid)
                        msg ='error'

        except Exception, e:
            print e
            return 'error'

        return msg