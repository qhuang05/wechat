#!/usr/bin/env python
# -*- coding: utf-8 -*-
from src.wechat.mine.medal import satisfied_not

__author__ = 'bac'

from flask import Blueprint, request
from . import DeliveryBiz, login_required
from src.tools import HTTP

bp = Blueprint("delivery", __name__)


@bp.route("/login", methods=["POST"])
def login():
    """
    配送远登录
    :return:
    """
    user = request.values["user"]
    passwd = request.values["pass"]
    device_token = request.values.get("deviceToken")

    biz = DeliveryBiz()
    res, data = biz.login(user, passwd, device_token)
    if res:
        return HTTP.success_json(data=data)
    else:
        return HTTP.error_json(400, data)


@bp.route("/orders")
@login_required
def get_orders():
    """
    获取订单数据
    :return:
    """
    user_id = HTTP.get_login_user_id()
    finished = request.values.get("finished")

    biz = DeliveryBiz()
    res = biz.get_orders(user_id, finished)
    return HTTP.success_json(orders=res)


@bp.route("/order/<int:order_id>")
@login_required
def get_order_detail(order_id):
    """
    接受新订单
    :return:
    """
    user_id = HTTP.get_login_user_id()

    biz = DeliveryBiz()

    order_data = biz.get_order(order_id, user_id)
    if order_data:
        return HTTP.success_json(order=order_data)
    else:
        return HTTP.error_json(404, "找不到此订单")


@bp.route("/devicetoken", methods=["POST"])
@login_required
def update_device_token():
    """
    保存devicetoken
    :return:
    """
    delivery_id = HTTP.get_login_user_id()
    device_token = request.values["deviceToken"]
    biz = DeliveryBiz()
    if biz.save_device_token(delivery_id, device_token):
        return HTTP.success_json()
    else:
        return HTTP.error_json(500, "保存失败了")


@bp.route("/order/<int:order_id>/accept", methods=["POST"])
@login_required
def accept_order(order_id):
    """
    接受订单
    :param order_id:
    :return:
    """
    delivery_id = HTTP.get_login_user_id()

    biz = DeliveryBiz()

    if biz.accept_order(delivery_id, order_id):
        return HTTP.success_json()
    else:
        return HTTP.error_json(500, "操作失败")


@bp.route("/order/<int:order_id>/done", methods=["POST"])
@login_required
def finish_order(order_id):
    """
    接受订单
    :param order_id:
    :return:
    """
    delivery_id = HTTP.get_login_user_id()

    biz = DeliveryBiz()

    if biz.finish_order(delivery_id, order_id):
        satisfied_not()  # 完成订单检查勋章,满足条件的授予
        return HTTP.success_json()
    else:
        return HTTP.error_json(500, "操作失败")


@bp.route("/0/password", methods=["POST"])
@login_required
def change_password():
    """
    修改密码
    :return:
    """
    delivery_id = HTTP.get_login_user_id()
    old_pass = request.values["old_pass"]
    new_pass = request.values["new_pass"]
    if not new_pass:
        return HTTP.error_json(400, "密码不能为空")

    biz = DeliveryBiz()
    res, msg = biz.change_password(delivery_id, old_pass, new_pass)
    if res:
        return HTTP.success_json()
    else:
        return HTTP.error_json(500, "修改失败," + msg)


@bp.route("/0/location", methods=["POST"])
@login_required
def update_location():
    """
    更新配送远坐标
    :return:
    """
    delivery_id = HTTP.get_login_user_id()
    lat = request.values["latitude"]
    lng = request.values["longitude"]

    biz = DeliveryBiz()

    if biz.update_location(delivery_id=delivery_id, latitude=lat, longitude=lng):
        return HTTP.success_json()
    else:
        return HTTP.error_json(500, "更新失败")


@bp.route("/testpush")
def test_push():
    order_id = request.values.get("id")
    deliver_id = request.values.get("to")
    biz = DeliveryBiz()

    biz.push_new_order_message(deliver_id if deliver_id else 1, "新订单来了", order_id if order_id else 1)
    return HTTP.success_json(message="OK")
