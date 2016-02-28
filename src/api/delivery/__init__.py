#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'bac'

from src import biz
from src.tools import Encrypt
from flask import request, current_app
from src.tools import HTTP, JSON
from functools import wraps
from apns import APNs, Payload
from src.wechat.api import WxManager
import requests

sql_select_delivery_by_user_and_pass = """
    select * from BM_Delivery where DELIVERY_CODE =:user and DELIVERY_PWD = :password and IS_EFFECT = '0'
"""

sql_select_password_by_id = """
    select DELIVERY_PWD from BM_Delivery where ID = :id
"""

sql_select_orders = """
    select o.ID as id,
    o.ORDER_ADDRESS as customer_location,
    o.ORDER_LATITUDE as latitude,
    o.ORDER_LONGITUDE as longitude,
    date_format(o.ORDER_TIME,'%H:%i') as order_time,
    os.SEND_STATUS as status
    from BO_Orders o
    inner join BO_OrderSend os
      on o.ID = os.ORDER_ID and os.DELIVERY_ID = :delivery_id
      and o.ORDER_TIME between current_date() and DATE_ADD(current_date(),INTERVAL 1 day)
      {% if finished %}
        and os.SEND_STATUS ='03'
        WHERE os.IS_EFFECT='0'
        order by os.END_TIME desc
      {% else %}
        and os.SEND_STATUS in ('01','02')
        WHERE os.IS_EFFECT='0'
        order by o.ORDER_TIME
      {% endif %}
"""

sql_select_order = """
    select o.ID as id,
    o.ORDERNO as order_no,
    co.OTHERNAME as customer_name,
    o.ORDER_ADDRESS as customer_location,
    co.OTHERTEL as customer_telephone,
    o.ORDER_LONGITUDE as longitude,
    o.ORDER_LATITUDE as latitude,
    o.ORDER_MONEY as order_total,
    date_format(o.ORDER_TIME,'%H:%i') as order_time,
    os.SEND_STATUS as status,
    o.DEFRAY_STATUS as defray_status,
    o.REMARK as remark
    from BO_Orders o
    inner join BM_Client_Other co on o.OTHER_ID=co.ID
    inner join BO_OrderSend os on o.ID = os.ORDER_ID
    and o.ID = :order_id
"""

sql_select_device_token_by_delivery_id = """
    select DEVICE_TOKEN from BM_Delivery where ID = :delivery_id
"""

sql_update_device_token = """
    update BM_Delivery set DEVICE_TOKEN = :device_token where ID = :delivery_id
"""

sql_accept_order = """
    update BO_OrderSend set SEND_STATUS = '02',SEND_TIME=NOW() where ORDER_ID=:order_id and DELIVERY_ID=:delivery_id and SEND_STATUS='01'
"""

sql_finish_order = """
    update BO_OrderSend set SEND_STATUS = '03',END_TIME=NOW() where ORDER_ID=:order_id and DELIVERY_ID=:delivery_id and SEND_STATUS='02'
"""
sql_select_order_items = """
    select od.ID id,
        ac.ARTICLE_NAME as name,
        od.ARTICLE_COUNT as quantity,
        od.ARTICLE_MONEY as total,
        ac.SMALL_IMGURL as image
    FROM BO_Orders O
    INNER JOIN BO_OrderDetails od ON O.ID = od.ORDER_ID
    INNER JOIN BS_ArticleChild ac ON od.ARTICLECHILD_ID = ac.ID
    WHERE O.IS_EFFECT='0' AND od.IS_EFFECT='0' AND O.ID=:order_id
"""

sql_change_password = """
    update BM_Delivery set DELIVERY_PWD = :new_pass where ID = :delivery_id and DELIVERY_PWD = :old_pass
"""

sql_update_location = """
    update BM_Delivery set LONGITUDE = :longitude ,LATITUDE = :latitude where ID = :delivery_id
"""

# 完成订单状态修改
sql_update_order_status="""
    update BO_Orders set ORDER_STATUS='03', DEFRAY_STATUS='01' WHERE ID=:order_id
"""

# 查询客户openid
sql_select_order_by_client_openid="""
    SELECT CLIENT_OPENID
    FROM BO_Orders o
    INNER JOIN BM_Client_Other co ON o.OTHER_ID=co.ID
    INNER JOIN BM_Client c ON co.CLIENT_ID = c.ID
    WHERE o.ORDER_TYPE='01' AND o.ID=:order_id
"""


def login_required(func):
    @wraps(func)
    def deco(*args, **kwargs):
        user_id = request.headers.get("X-User-Id")
        auth = request.headers.get("X-Auth")
        app_version = request.headers.get("X-App-Version")
        seed = request.headers.get("X-Seed")
        method = request.method
        path = request.path
        if user_id and auth and app_version and seed:
            bbiz = DeliveryBiz()
            user_key = bbiz.get_user_key(user_id)
            if user_key:
                content = method + "\n" + path + "\n" + user_id + "\n" + seed + "\n" + app_version
                auth_to_check = Encrypt.hmac_with_sha1(user_key, content)

                auth_to_check = Encrypt.base64_encode(auth_to_check)
                if auth_to_check == auth:
                    return func(*args, **kwargs)

        return HTTP.error_json(401, "非法请求")

    return deco


class DeliveryBiz(biz.Biz):
    def __init__(self):
        """

        :return:
        """

    def login(self, user, passwd, device_token=None):
        """

        :param user:
        :return:
        """
        hashed_passwd = Encrypt.hash_sha1(passwd)
        res = self.executeSql(sql_select_delivery_by_user_and_pass, password=hashed_passwd, user=user).first()
        if res:
            delivery_id = res["ID"]
            if device_token:
                if self.executeSql(sql_update_device_token, delivery_id=delivery_id,
                                   device_token=device_token).rowcount <= 0:
                    return False, "保存device token失败了"

            return True, dict(id=res["ID"], key=Encrypt.hash_sha1(str(res["ID"]) + hashed_passwd),
                              name=res["DELIVERY_NAME"])
        return False, "帐号不存在或密码错误"

    def get_user_key(self, user_id):
        """
        验证请求是否合法
        :param user_id:
        :param user_auth:
        :return:
        """
        passwd = self.executeSql(sql_select_password_by_id, id=user_id).one()
        if passwd:
            return Encrypt.hash_sha1(str(user_id) + passwd)
        return None

    def get_orders(self, delivery_id, finished=None):
        """
        查询配送员的订单
        :param delivery_id:
        :return:
        """
        res = self.executeSql(sql_select_orders, delivery_id=delivery_id, finished=finished).all()
        return res

    def get_order(self, order_id, user_id):
        """
        查询订单详情
        :param order_id:
        :param user_id:
        :return:
        """
        res = self.executeSql(sql_select_order, delivery_id=user_id, order_id=order_id).first()
        if res:
            res["items"] = self.executeSql(sql_select_order_items, order_id=order_id).all()

        return res

    def push_message(self, delivery_id, alert, badge=1, **kwargs):
        """
        发送对送消息的指定配送员的手机
        :param delivery_id:
        :param alert: 消息的提醒内容
        :param badge: app图表上的数字
        :param kwargs:
        :return:
        """

        device_token = self.executeSql(sql_select_device_token_by_delivery_id, delivery_id=delivery_id).one()
        if not device_token:
            return False, "找不到对应的DeviceToken,无法发送推送"

        sandbox = current_app.debug

        apns = APNs(use_sandbox=sandbox, cert_file=current_app.config.get("APNS_KEY_FILE"),
                    key_file=current_app.config.get("APNS_KEY_FILE"))

        payload = Payload(alert=alert, sound="default", badge=badge, custom=kwargs)
        res = apns.gateway_server.send_notification(device_token, payload)

        return True, None

    def push_new_order_message(self, delivery_id, alert, order_id):
        """

        :param delivery_id:
        :param alert:
        :param order_id:
        :return:
        """
        try:
            self.push_message(delivery_id, alert=alert, badge=1, type="new_order", order_id=order_id)
            self.push_message_android(delivery_id, alert='新订单', desc=alert, notify_id=order_id, type="new_order",
                                      order_id=order_id)
        except Exception, e:
            print e
        return True, None

    def push_message_android(self, delivery_id, alert, desc=None, notify_id=None, **kwargs):

        par = dict(title=alert, alias="delivery_" + str(delivery_id), description=desc,
                   notify_id=notify_id, pass_through=0,
                   payload=JSON.dumps(kwargs))
        par["extra.notify_foreground"] = 1
        par["notify_type"] = -1
        res = requests.post("https://api.xmpush.xiaomi.com/v2/message/alias",
                            par,
                            headers={"Authorization": "key=" + current_app.config.get("MIPUSH_SECRET")})
        if res.status_code == 200 and JSON.loads(res.content)["result"] == "ok":
            return True
        else:
            current_app.logger.error("推送失败了:%s" + str(res))
            return False

    def save_device_token(self, delivery_id, device_token):
        """
        保存配送员的device token
        :param delivery_id:
        :param device_tofken:
        :return:
        """
        return self.executeSql(sql_update_device_token, delivery_id=delivery_id,
                               device_token=device_token).rowcount > 0;

    def accept_order(self, delivery_id, order_id):
        """
        接受订单,修改订单状态为02:在途
        :param delivery_id:
        :param order_id:
        :return:
        """
        openid=self.executeSql(sql_select_order_by_client_openid, order_id=order_id).one()
        if openid:
            info = WxManager()
            info.get_News(str(openid), '玩啤提醒您，配送员已接单，正在配送中，请您耐心等待！')

        return self.executeSql(sql_accept_order, delivery_id=delivery_id, order_id=order_id).rowcount > 0

    def finish_order(self, delivery_id, order_id):
        """
        完成订单,修改订单状态为03:已完成
        :param delivery_id:
        :param order_id:
        :return:
        """
        openid=self.executeSql(sql_select_order_by_client_openid, order_id=order_id).one()
        if openid:
            info = WxManager()
            info.get_News(str(openid), '玩啤提醒您，订单已签收，欢迎您再次登陆平台选购商品！')

        self.executeSql(sql_update_order_status, order_id=order_id)

        return self.executeSql(sql_finish_order, delivery_id=delivery_id, order_id=order_id).rowcount > 0

    def change_password(self, delivery_id, old_pass, new_pass):
        """
        修改密码
        :param delivery_id:
        :param old_pass:
        :param new_pass:
        :return:
        """

        res = self.executeSql(sql_change_password, delivery_id=delivery_id, old_pass=Encrypt.hash_sha1(old_pass),
                              new_pass=Encrypt.hash_sha1(new_pass)).rowcount > 0

        if res:
            return True, None
        else:
            return False, "可能是旧密码错误"

    def update_location(self, delivery_id, latitude, longitude):
        """
        更新配送员坐标
        :param delivery_id:
        :param latitude:
        :param longitude:
        :return:
        """

        return self.executeSql(sql_update_location, delivery_id=delivery_id, latitude=latitude,
                               longitude=longitude).rowcount > 0
