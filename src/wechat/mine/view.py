#!/usr/bin/env python
# -*- coding: utf-8 -*-
from flask import Blueprint, request, render_template, redirect, url_for, session
from src.wechat.mall import Mall
from . import Collection, Users
from src.wechat import location
from src.web.unit import SerialNo
import json

__author__ = 'hqh'
bp = Blueprint("mine", __name__)

# 显示我的收藏列表
@bp.route('/mine/myCollections', methods=['GET', 'POST'])
def showMyCollections():
    clientId = '1'
    # clientId = session['client_id']
    myCollect = Collection()
    colList = myCollect.getMyCollections(clientId)
    print colList
    return render_template('wechat/mine/myCollections.html', colList=colList)

# 显示商品详情
@bp.route('/mall/goodDetails', methods=['GET', 'POST'])
def showGoodDetails():
    clientId = '1'
    # clientId = session['client_id']
    goodID = request.values.get('id')
    goodDetails = Collection()
    goodInfo = goodDetails.getGoodDetails(goodID)
    status = goodDetails.isCollected(clientId, goodID)
    print goodID, goodInfo, status
    return render_template('wechat/mall/goodDetails.html', goodInfo=goodInfo, status=status)

# 在收藏列表中,设置为收藏状态
@bp.route('/mine/enableCollect', methods=['GET', 'POST'])
def enableCollect():
    clientId = '1'
    # clientId = session['client_id']
    goodID = request.values.get('id')
    print goodID
    myCollect = Collection()
    myCollect.enableCollect(clientId, goodID)
    return '1'

# 在收藏列表中,设置为未收藏状态
@bp.route('/mine/disableCollect', methods=['GET', 'POST'])
def disableCollect():
    clientId = '1'
    # clientId = session['client_id']
    goodID = request.values.get('id')
    print goodID
    myCollect = Collection()
    myCollect.disableCollect(clientId, goodID)
    return '1'

# 添加到我的收藏里(用户之前没有收藏过此商品)
@bp.route('/mine/addCollect', methods=['GET', 'POST'])
def addCollect():
    clientId = '1'
    # clientId = session['client_id']
    goodID = request.values.get('id')
    print goodID
    myCollect = Collection()
    myCollect.addCollect(clientId, goodID)
    return '1'

# 提交订单页面
@bp.route('/mall/orderSubmit', methods=['GET', 'POST'])
def orderSubmit():
    # clientId = session['client_id']
    # orderId = session['orderKey']
    clientId = '1'
    orderId = '1'
    voucherId = request.values.get('voucher_id')
    userInfo = Users()
    consignee = userInfo.getDefaultConsignee(clientId)
    num = userInfo.getUseableVouchersNum(clientId)         # 查询可用优惠券数量
    money = userInfo.getVouchersMoney(voucherId)              # 查询优惠券面额
    vouchers = {}
    vouchers['num'] = num
    vouchers['id'] = voucherId
    vouchers['money'] = money
    if(vouchers['id']):
        status = '1'       # '1'表示使用优惠券
    else:
        status = '0'        # 0'表示不使用优惠券
    goodsList = userInfo.selectOrderGoodsDetails(orderId)
    print consignee, vouchers, goodsList
    return render_template('/wechat/mall/orderSubmit.html', consignee=consignee, goodsList=goodsList, vouchers=vouchers, status=status)

# 查询优惠券面额
@bp.route('/mall/getVoucherMoney', methods=['GET', 'POST'])
def getVoucherMoney():
    voucherId = request.values.get('voucher_id')
    userInfo = Users()
    money = str(userInfo.getVouchersMoney(voucherId))
    print money
    return money

# 进入管理收货人页面
@bp.route('/mine/selectConsignee', methods=['GET', 'POST'])
def selectConsignee():
    clientId = '1'
    # clientId = session['client_id']
    userInfo = Users()
    consigneeList = userInfo.getConsigneeList(clientId)
    print consigneeList
    return render_template('/wechat/mine/consigneeInfo.html', consigneeList=consigneeList)

# 删除收货人
@bp.route('/mine/delConsignee', methods=['GET', 'POST'])
def delConsignee():
    clientId = '1'
    # clientId = session['client_id']
    userInfo = Users()
    delId = request.values.get('id')
    res = userInfo.disableConsignee(clientId, delId)
    return "1"

# 进入新增收货人姓名,电话页面
@bp.route('/mine/addConsigneePage', methods=['GET', 'POST'])
def addConsigneePage():
    return render_template('/wechat/mine/addConsignee.html')

# 收货人是否已经存在
@bp.route('/mine/checkConsignee', methods=['GET', 'POST'])
def checkConsignee():
    clientId = '1'
    # clientId = session['client_id']
    name = request.values.get('name')
    tel = request.values.get('tel')
    userInfo = Users()
    res = userInfo.checkConsignee(clientId, name, tel)
    print name, tel, res
    if res==0:
        print '不存在'
        return '0'
    else:
        print '存在'
        return '1'

# 新增收货人姓名,电话
@bp.route('/mine/addConsignee', methods=['GET', 'POST'])
def addConsignee():
    clientId = '1'
    # clientId = session['client_id']
    name = request.form.get('name')
    telephone = request.form.get('telephone')
    userInfo = Users()
    res = userInfo.addConsignee(clientId, name, telephone)
    return redirect('/mine/selectConsignee')

# 选择收货地址
@bp.route('/mine/addrManage', methods=['GET', 'POST'])
def addrManage():
    clientId = '1'
    # clientId = session['client_id']
    userInfo = Users()
    historyAddr = userInfo.getHistoryAddr(clientId)
    return render_template('/wechat/mine/addressInfo.html', historyAddr=historyAddr)

# 用户搜索地址关键字后模糊匹配地址列表
@bp.route('/mine/addrSearchList', methods=['GET', 'POST'])
def addrSearchList():
    addrText = request.values.get('address')
    userInfo = location()
    addrSearchResult = userInfo.tx_oprition(addrText)
    _addrSearchResult = json.dumps(addrSearchResult)
    print _addrSearchResult
    return _addrSearchResult

# 获取订单中的商品图片地址
# @bp.route('/mall/getGoodsImgs', methods=['GET', 'POST'])
# def getGoodsImgs():
#     goodsIdArr = request.values.getlist('goodsid[]')
#     print goodsIdArr
#     goodInfo = Collection()
#     goodsImgsUrl = {}
#     for i in goodsIdArr:
#         imgSrc = goodInfo.getGoodDetails(i)['IMG_URL']
#         goodsImgsUrl[i] = imgSrc
#     _goodsImgsUrl = json.dumps(goodsImgsUrl)
#     print _goodsImgsUrl
#     return _goodsImgsUrl

# 微信货到付款
@bp.route('/mall/deliverypay', methods=['GET', 'POST'])
def deliverypay():
    clientId = '1'
    orderId = '1'
    # clientId = session['client_id']
    # orderId = session['orderKey']
    price = request.form.get('totalPrice')
    couponsId = request.form.get('voucher')
    orderName = request.form.get('consigneeName')
    orderTel = request.form.get('consigneeTel')
    consigneeId = request.form.get('consigneeId')
    address = request.form.get('consigneeAddr')
    longitude = request.form.get('consigneeAddrLng')
    latitude = request.form.get('consigneeAddrLat')
    time = request.form.get('reachedTime')
    remark = request.form.get('notes')
    if longitude=="":
        biz = location()
        locat = biz.tx_addresstolocation(address)
        res = json.dumps(locat)
        longitude = json.loads(res)["lng"]
        latitude = json.loads(res)["lat"]
    """
    货到付款
    ORDER_STATUS     订单状态(0:新增;01:待分配；02:已分配; 03:已完成)
    DEFRAY_TYPE      支付类型(01:在线支付；02:货到支付)
    DEFRAY_STATUS    支付状态(01:已支付；02：未支付; 03:预支付)
    ORDER_TYPE			 订单类型（01:微信；02:电话）
    """
    order = Users()
    orderCount = order.checkSuccessOrder(orderId, '01', '02', '03', '01')
    print orderCount
    if orderCount == 0:             # 待分配状态(点击结算/开喝后的状态)
        order.updateOrder(orderId, orderTel, address, longitude, latitude, time, remark, couponsId, price, consigneeId)
    orderMsgDetails = order.selectOrderMsgDetails(orderId)
    orderGoodsDetails = order.selectOrderGoodsDetails(orderId)
    orderStatus = order.selectOrderStatus(orderId)
    voucherMoney = order.getVouchersMoney(couponsId)
    # session['one_order'] = '0'                      #当支付成功时此订单结束，用户没有关闭网页的情况下可以继续购物，生成新的order_id
    order.insertHistoryAddr(orderId, address, longitude, latitude)          # 把订单地址写入历史地址记录表里
    order.updateDefaultConsignee(clientId, orderName, orderTel)           # 更新默认收货人信息
    if couponsId:
        order.disactiveVoucher(clientId, couponsId)                             # 更新我的优惠券信息
    return render_template('/wechat/mine/orderDetails.html', orderGoodsDetails=orderGoodsDetails, orderMsgDetails=orderMsgDetails, orderStatus=orderStatus, voucherMoney=voucherMoney)

# 进入订单详情页
@bp.route('/mine/orderDetails', methods=['GET', 'POST'])
def orderDetails():
    clientId = '1'
    # clientId = session['client_id']
    orderId = request.args.get('id')
    order = Users()
    voucherId = order.selectOrderVoucher(orderId)
    voucherMoney = order.getVouchersMoney(voucherId)
    orderGoodsDetails = order.selectOrderGoodsDetails(orderId)
    orderMsgDetails = order.selectOrderMsgDetails(orderId)
    orderStatus = order.selectOrderStatus(orderId)
    print orderGoodsDetails, orderMsgDetails, orderStatus
    return render_template('/wechat/mine/orderDetails.html', orderGoodsDetails=orderGoodsDetails, orderMsgDetails=orderMsgDetails, orderStatus=orderStatus, voucherMoney=voucherMoney)

