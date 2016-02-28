#!/usr/bin/env python
# -*- coding: utf-8 -*-
from src import biz

__author__ = 'hqh'
# 根据open_id查询client_id
sql_select_clientID = """
SELECT ID FROM BM_Client WHERE CLIENT_OPENID = :open_id
"""

# 根据client_id查询收藏的商品信息
sql_select_all_collections = """
SELECT ac.ID, ac.SMALL_IMGURL, ac.ARTICLE_NAME, ac.UNIT_PRICE, c.IS_EFFECT FROM BM_Collect as c
INNER JOIN BM_Client as u ON u.ID = c.CLIENT_ID
INNER JOIN BS_ArticleChild as ac ON ac.ID = c.ARTICLECHILD_ID
WHERE u.ID = :client_id AND c.IS_EFFECT = '0'
ORDER BY ac.ID ASC
"""

# 根据id查询某个商品的信息
sql_select_good_info = """
SELECT ac.ID, ac.IMG_URL, ac.ARTICLE_NAME, ac.ARTICLE_EXPLAIN, ac.UNIT_PRICE, bc.TOLERANT_BOTTLE
FROM BS_ArticleChild as ac, BS_Article AS bc
WHERE ac.ID = :good_id AND ac.ARTICLE_ID=bc.ID AND ac.IS_EFFECT = '0'
"""

# 添加商品收藏
sql_add_collect = """
INSERT INTO BM_Collect (CLIENT_ID, ARTICLECHILD_ID, IS_EFFECT, CREATE_TIME) VALUES
(:client_id, :good_id, '0', Now())
"""

# 删除商品收藏
sql_del_collect = """
DELETE * FROM BM_Collect
WHERE CLIENT_ID = :client_id AND ARTICLECHILD_ID = :good_id
"""

# 把商品收藏状态设置为'有效'
sql_active_collect = """
UPDATE BM_Collect SET IS_EFFECT='0'
WHERE CLIENT_ID = :client_id AND ARTICLECHILD_ID = :good_id
"""

# 把商品收藏状态设置为'无效'
sql_disactive_collect = """
UPDATE BM_Collect SET IS_EFFECT='1'
WHERE CLIENT_ID = :client_id AND ARTICLECHILD_ID = :good_id
"""

# 查询商品是否在客户的收藏列表里
sql_check_iseffect = """
SELECT c.IS_EFFECT FROM BM_Collect as c
INNER JOIN BM_Client as u ON u.ID = c.CLIENT_ID
WHERE u.ID = :client_id AND c.ARTICLECHILD_ID = :good_id
"""

# 获取用户默认的收货人信息(姓名,电话,地址)
sql_select_default_consignee = """
SELECT uo.ID, uo.OTHERTEL, uo.OTHERNAME, uo.CLIENT_ADDR FROM BM_Client_Other as uo
INNER JOIN BM_Client as u ON u.ID = uo.CLIENT_ID
WHERE u.ID = :client_id AND uo.IS_DEFAULT = '1' AND uo.IS_EFFECT = '0'
"""

# 获取用户的收货人列表
sql_select_all_consignee = """
SELECT uo.ID, uo.OTHERTEL, uo.OTHERNAME FROM BM_Client_Other as uo
INNER JOIN BM_Client as u ON u.ID = uo.CLIENT_ID
WHERE u.ID = :client_id AND uo.IS_EFFECT = '0'
"""

# 将收货人置为无效状态
sql_disactive_consignee = """
UPDATE BM_Client_Other SET IS_EFFECT='1'
WHERE CLIENT_ID = :client_id AND ID = :consignee_id
"""

# 查询用户是否有至少一个的收货人信息
sql_check_has_consignee = """
SELECT COUNT(*) FROM BM_Client_Other WHERE CLIENT_ID = :client_id AND IS_EFFECT='0'
"""

# 查询收货人信息是否已经存在
sql_check_is_consignee_exist = """
SELECT COUNT(*) FROM BM_Client_Other WHERE client_id=client_id AND OTHERNAME=:name AND OTHERTEL=:telephone AND IS_EFFECT='0'
"""

# 新增收货人信息(姓名,电话)
sql_add_consignee = """
INSERT INTO BM_Client_Other (CLIENT_ID, IS_DEFAULT, IS_EFFECT, OTHERTEL, OTHERNAME, CREATE_TIME) VALUES
(:client_id, '0', '0', :telephone, :name, NOW())
"""

# 新增默认收货人信息(姓名,电话)
sql_add_default_consignee = """
INSERT INTO BM_Client_Other (CLIENT_ID, IS_DEFAULT, IS_EFFECT, OTHERTEL, OTHERNAME, CREATE_TIME) VALUES
(:client_id, '1', '0', :telephone, :name, NOW())
"""

# 修改用户的默认收货人
sql_disable_default_consignee = """
UPDATE BM_Client_Other SET IS_DEFAULT='0' WHERE client_id=client_id AND IS_EFFECT='0'
"""
sql_update_default_consignee = """
UPDATE BM_Client_Other SET IS_DEFAULT='1' WHERE client_id=:client_id AND OTHERNAME=:name AND OTHERTEL=:telephone AND IS_EFFECT='0'
"""

# 查询用户收货地址的历史记录
sql_select_historyAddr = """
SELECT * FROM BM_Historical_Position
WHERE CLIENT_ID = :client_id AND IS_EFFECT = '0'
"""

# 查询某个历史记录是否存在
sql_check_is_address_exist = """
SELECT HISTORICAL_POSITION FROM BM_Historical_Position WHERE HISTORICAL_POSITION=:address
"""

# 将地址插入历史记录
sql_insert_history_position = """
INSERT INTO BM_Historical_Position (CLIENT_ID,BD_LONGITUDE,BD_LATITUDE,HISTORICAL_POSITION,CREATE_TIME,IS_EFFECT)
VALUES (:client_id,:longitude,:latitude,:address,NOW(),'0')
"""

# 更新历史记录地址时间
sql_update_history_position = """
UPDATE BM_Historical_Position SET CREATE_TIME = NOW() WHERE HISTORICAL_POSITION=:address
"""

# 查询用户可用的优惠券数量
sql_select_useable_vouchers = """
SELECT COUNT(*) FROM BM_Wallet WHERE CLIENT_ID =:client_id AND USE_STATUS ='02' AND IS_EFFECT = '0'
"""

# 根据优惠券id查询对应面额
sql_select_vouchers_money = """
SELECT WALLET_MONEY FROM BM_Wallet WHERE ID = :voucher_id
"""

# 将用户的某张优惠券(根据优惠券id)置为'无效'
sql_disactive_voucher = """
UPDATE BM_Wallet SET IS_EFFECT='1' WHERE CLIENT_ID=:client_id AND ID=:voucher_id
"""

# 点击货到付款时更新主订单信息
sql_update_order = """
UPDATE BO_Orders SET ORDER_ADDRESS=:address, ORDER_LONGITUDE=:longitude, ORDER_LATITUDE=:latitude,
APPTIME_ID=:apptime_id, REMARK=:remark, SUBMIT_TIME=NOW(), END_TIME=DATE_ADD(SUBMIT_TIME,INTERVAL 20 MINUTE), ORDER_TIME=DATE_ADD(SUBMIT_TIME,INTERVAL 20 MINUTE), ORDER_TEL=:other_tel,
DEFRAY_STATUS='03',DEFRAY_TYPE='02', ORDER_STATUS='02', ORDER_TYPE='01', WALLETID =:coupons_id, ORDER_MONEY=:price, OTHER_ID=:consignee_id
WHERE ID =:order_id
"""

# 查询订单是否已经成功提交
sql_select_by_order_success = """
SELECT COUNT(*) FROM BO_Orders
WHERE ORDER_STATUS!=:order_status AND DEFRAY_TYPE=:defray_type AND DEFRAY_STATUS=:defray_status AND ORDER_TYPE=:order_type AND ID=:order_id AND IS_EFFECT='0'
"""

# 根据订单号查询该订单的商品信息
sql_select_order_goods_details = """
SELECT o.ID, o.ORDER_MONEY, ac.SMALL_IMGURL, ac.PRODUCT_NAME, ac.UNIT_PRICE, od.ARTICLE_COUNT, od.ARTICLE_MONEY, ac.BEER_UNIT, ac.ID
FROM BO_Orders as o
INNER JOIN BO_OrderDetails as od ON o.ID = od.ORDER_ID
INNER JOIN BS_ArticleChild as ac ON ac.ID = od.ARTICLECHILD_ID
INNER JOIN BS_Article as a ON ac.ARTICLE_ID = a.ID
WHERE o.ID=:order_id AND od.IS_EFFECT='0' AND o.IS_EFFECT='0'
"""

# 根据订单号查询该订单是否处于已接单状态
sql_check_order_accepted = """
SELECT count(*) FROM BO_OrderSend WHERE ORDER_ID=:order_id
"""

# 根据订单号查询该订单的消息详情信息(已提交,但还未接单)
sql_select_order_msg_details1 = """
SELECT o.ID, o.ORDERNO, o.ORDER_MONEY, o.SUBMIT_TIME, uo.OTHERNAME, o.ORDER_TEL, o.OTHER_ID, o.ORDER_ADDRESS, o.ORDER_LONGITUDE, o.ORDER_LATITUDE, REMARK, o.DEFRAY_TYPE
FROM BO_Orders as o
INNER JOIN BM_Client_Other as uo ON o.OTHER_ID = uo.ID
WHERE o.ID=:order_id
"""
# 根据订单号查询该订单的消息详情信息(已接单)
sql_select_order_msg_details2 = """
SELECT o.ID, o.ORDERNO, o.ORDER_MONEY, o.SUBMIT_TIME, uo.OTHERNAME, o.ORDER_TEL, o.OTHER_ID, o.ORDER_ADDRESS, o.ORDER_LONGITUDE, o.ORDER_LATITUDE, REMARK, o.DEFRAY_TYPE, os.SEND_STATUS
FROM BO_Orders as o
INNER JOIN BM_Client_Other as uo ON o.OTHER_ID = uo.ID
INNER JOIN BO_OrderSend as os ON o.ID = os.ORDER_ID
WHERE o.ID=:order_id
"""

# 根据订单号查询使用的优惠券id
sql_select_order_voucher = """
SELECT o.WALLETID FROM BO_Orders as o WHERE o.ID=:order_id
"""

# 根据订单号查询该订单进度状态(已接单)
sql_select_order_status = """
SELECT o.SUBMIT_TIME,os.CREATE_TIME, os.SEND_TIME, os.END_TIME, os.SEND_STATUS, d.DELIVERY_TEL
FROM BO_Orders as o
INNER JOIN BO_OrderSend as os ON o.ID = os.ORDER_ID
INNER JOIN BM_Delivery as d ON d.ID = os.DELIVERY_ID
WHERE o.ID=:order_id
"""

class Collection(biz.Biz):
    def __init__(self):
        return

    def getMyCollections(self, client_id):
        """
        显示我的收藏列表
        :param open_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_all_collections, client_id=client_id).all()
        except Exception, e:
            print e
        return res

    def getGoodDetails(self, good_id):
        """
        显示商品详情
        :param good_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_good_info, good_id=good_id).first()
        except Exception, e:
            print e
        return res

    def isCollected(self, client_id, good_id):
        """
        查询商品是否在客户的收藏列表里,none或1表示未收藏
        :param open_id,good_id:
        :return:
        """
        try:
            res = self.executeSql(sql_check_iseffect, client_id=client_id, good_id=good_id).one()
        except Exception, e:
            print e
        print res
        return res

    def enableCollect(self, client_id, good_id):
        """
        在收藏列表中,设置为收藏状态
        :param open_id,good_id:
        :return:
        """
        try:
            res = self.executeSql(sql_active_collect, client_id=client_id, good_id=good_id)
        except Exception, e:
            print e
        return

    def disableCollect(self, client_id, good_id):
        """
        在收藏列表中,设置为未收藏状态
        :param open_id,good_id:
        :return:
        """
        try:
            res = self.executeSql(sql_disactive_collect, client_id=client_id, good_id=good_id)
        except Exception, e:
            print e
        return

    def addCollect(self, client_id, good_id):
        """
        添加到我的收藏里(用户之前没有收藏过此商品)
        :param open_id,good_id:
        :return:
        """
        try:
            res = self.executeSql(sql_add_collect, client_id=client_id, good_id=good_id)
        except Exception, e:
            print e
        return


class Users(biz.Biz):
    def __init__(self):
        return

    def getDefaultConsignee(self, client_id):
        """
        获取用户默认的收货人信息(姓名,电话)
        :param open_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_default_consignee, client_id=client_id).first()
        except Exception, e:
            print e
        return res

    def getConsigneeList(self, client_id):
        """
        获取用户的收货人列表
        :param open_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_all_consignee, client_id=client_id).all()
        except Exception, e:
            print e
        return res

    def disableConsignee(self, client_id, consignee_id):
        """
        将收货人置为无效状态
        :param open_id:
        :param name:
        :param telephone:
        :return:
        """
        try:
            res = self.executeSql(sql_disactive_consignee, client_id=client_id, consignee_id=consignee_id)
        except Exception, e:
            print e
        return

    def checkConsignee(self, client_id, name, telephone):
        """
        查询收货人信息是否已经存在
        """
        try:
            res = self.executeSql(sql_check_is_consignee_exist, client_id=client_id, name=name,
                                  telephone=telephone).one()
        except Exception, e:
            print e
        return res

    def addConsignee(self, client_id, name, telephone):
        """
        新增收货人信息(姓名,电话)
        :param open_id:
        :return:
        """
        try:
            flag = self.executeSql(sql_check_has_consignee, client_id=client_id).one()
            if flag == 0:
                self.executeSql(sql_add_default_consignee, client_id=client_id, name=name, telephone=telephone)
            else:
                self.executeSql(sql_add_consignee, client_id=client_id, name=name, telephone=telephone)
        except Exception, e:
            print e
        return

    def updateDefaultConsignee(self, client_id, name, telephone):
        """
        修改用户的默认收货人
        :param client_id:
        :param name:
        :param telephone:
        :return:
        """
        try:
            self.executeSql(sql_disable_default_consignee, client_id=client_id)
            self.executeSql(sql_update_default_consignee, client_id=client_id, name=name, telephone=telephone)
        except Exception, e:
            print e
        return

    def getHistoryAddr(self, client_id):
        """
        查询用户收货地址的历史记录
        :param open_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_historyAddr, client_id=client_id).all()
        except Exception, e:
            print e
        return res

    def insertHistoryAddr(self, client_id, address, longitude, latitude):
        """
        将地址插入历史记录
        :return:
        """
        flag = self.executeSql(sql_check_is_address_exist, address=address).rowcount
        if flag != 0:
            self.executeSql(sql_update_history_position, address=address)
        else:
            self.executeSql(sql_insert_history_position, client_id=client_id, address=address, longitude=longitude,
                            latitude=latitude)

    def getUseableVouchersNum(self, client_id):
        """
        查询用户可用的优惠券数量
        :param open_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_useable_vouchers, client_id=client_id).one()
        except Exception, e:
            print e
        return res

    def getVouchersMoney(self, voucher_id):
        """
        根据优惠券id查询对应面额
        :param voucher_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_vouchers_money, voucher_id=voucher_id).one()
        except Exception, e:
            print e
        return res

    def updateOrder(self, order_id, other_tel, address, longitude, latitude, apptime_id, remark, coupons_id, price, consignee_id):
        """
        点击货到付款时更新主订单信息
        """
        try:
            if coupons_id:
                coupons_id = int(coupons_id)
            else:
                coupons_id = 0
            res = self.executeSql(sql_update_order, order_id=order_id, other_tel=other_tel, address=address,
                                  longitude=longitude, latitude=latitude, apptime_id=apptime_id, remark=remark,
                                  coupons_id=coupons_id, price=price, consignee_id=consignee_id)
        except Exception, e:
            print e
        return

    def checkSuccessOrder(self, order_id, order_status, defray_type, defray_status, order_type):
        """
        查询订单是否已经成功提交
        @:param orderid
        @:return  记录数
        """
        try:
            msg = self.executeSql(sql_select_by_order_success, order_status=order_status, defray_type=defray_type,
                                  defray_status=defray_status, order_type=order_type, order_id=order_id).one()
        except Exception, e:
            print e
            return None
        return msg

    def selectOrderGoodsDetails(self, order_id):
        """
        根据订单号查询该订单的商品信息
        """
        try:
            msg = self.executeSql(sql_select_order_goods_details, order_id=order_id).all()
        except Exception, e:
            print e
            return None
        return msg

    def selectOrderMsgDetails(self, order_id):
        """
        根据订单号查询该订单的消息信息
        """
        try:
            flag = self.executeSql(sql_check_order_accepted, order_id=order_id).one()
            if flag==0:         # 订单已提交,但处于未接单状态
                msg = self.executeSql(sql_select_order_msg_details1, order_id=order_id).first()
            else:               # 订单已提交,并且已接单
                msg = self.executeSql(sql_select_order_msg_details2, order_id=order_id).first()
        except Exception, e:
            print e
        return msg

    def selectOrderVoucher(self, order_id):
        """
        根据订单号查询使用的优惠券id
        """
        try:
            msg = self.executeSql(sql_select_order_voucher, order_id=order_id).one()
        except Exception, e:
            print e
        return msg

    def disactiveVoucher(self, client_id, voucher_id):
        """
        将用户的某张优惠券(根据优惠券id)置为'无效'
        """
        try:
            msg = self.executeSql(sql_disactive_voucher, client_id=client_id, voucher_id=voucher_id)
        except Exception, e:
            print e
        return

    def selectOrderStatus(self, order_id):
        """
        根据订单号查询该订单进度状态
        """
        try:
            flag = self.executeSql(sql_check_order_accepted, order_id=order_id).one()
            if flag==0:         # 订单已提交,但处于未接单状态
                msg = self.executeSql(sql_select_order_msg_details1, order_id=order_id).first()
            else:               # 订单已提交,并且已接单
                msg = self.executeSql(sql_select_order_status, order_id=order_id).first()
        except Exception, e:
            print e
        return msg


# 勋章详情
sql_select_medal_detail = """
select * from BM_Medal WHERE ID = :medal_id;
"""
# 所有勋章信息
sql_select_all_medals = """
select * from BM_Medal WHERE IS_EFFECT='0';
"""
# 该用户的所有勋章信息
sql_select_user_medals = """
select * from BM_MedalDetails WHERE CLIENT_ID = :client_id;
"""
# 该用户的所有勋章信息
select_user_medals = """
select md_dtl.ID as did,md_dtl.MEDAL_ID as mdid,md_dtl.CLIENT_ID,md_dtl.CREATE_TIME,md_dtl.IS_EFFECT as mdeffect,
md.* from BM_Medal md LEFT JOIN BM_MedalDetails md_dtl
ON md.ID=md_dtl.MEDAL_ID WHERE md_dtl.CLIENT_ID = :client_id AND md.IS_EFFECT='0';
"""
# 查询获取数量
select_medals_count = """
select COUNT(*) as all_c,
(select COUNT(*) from BM_MedalDetails WHERE IS_EFFECT='0') as own_c,
COUNT(*)-(select COUNT(*) from BM_MedalDetails WHERE IS_EFFECT='0') as not_c
from BM_Medal;
"""
# 查询已获得的勋章
sql_select_collected_medal = """
select * FROM BM_MedalDetails WHERE CLIENT_ID = :client_id AND IS_EFFECT='0';
"""
# 查询消费者消费情况
sql_select_consumer_msg = """
select * from consumer_msg WHERE clntid=:client_id;
"""
# 插入满足条件的勋章id
sql_insert_medal = """
insert INTO BM_MedalDetails (MEDAL_ID,CLIENT_ID,CREATE_TIME,IS_EFFECT) VALUES (:medal_id,:client_id,NOW(),'0');
"""


class Medal(biz.Biz):
    """
    勋章类
    """

    def __init__(self):
        return

    def medal_detail(self, medal_id):
        """
        查询该勋章信息
        :param medal_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_medal_detail, medal_id=medal_id).first()
            return res
        except Exception, e:
            print e
            return None

    def all_medals(self):
        """
        所有勋章信息
        :return:
        """
        try:
            res = self.executeSql(sql_select_all_medals).all()
            return res
        except Exception, e:
            print e
            return None

    def user_medals(self, client_id):
        """
        该用户的勋章获得情况
        :param client_id:
        :return:
        """
        try:
            res = self.executeSql(select_user_medals, client_id=client_id).all()
            return res
        except Exception, e:
            print e
            return None

    def count_medals(self, client_id):
        """
        获取当前用户获取勋章的状况
        :param client_id:
        :return:
        """
        try:
            res = self.executeSql(select_medals_count, client_id=client_id).first()
            return res
        except Exception, e:
            print e
            return None

    def collected_medal(self, client_id):
        """
        收集到的勋章
        :param client_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_collected_medal, client_id=client_id).all()
            return res
        except Exception, e:
            print e
            return None

    def consumer_msg(self, client_id):
        """
        查询消费者消费情况
        :param client_id:
        :return:
        """
        try:
            res = self.executeSql(sql_select_consumer_msg, client_id=client_id).first()
            return res
        except Exception, e:
            print e
            return None

    def confer_medal(self, medal_id, client_id):
        """
        插入满足条件的勋章id
        :param medal_id:
        :param client_id:
        :return:
        """
        try:
            res = self.executeSql(sql_insert_medal, medal_id=medal_id, client_id=client_id).rowcount
            return res
        except Exception, e:
            print e
            return None
