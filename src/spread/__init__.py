#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'wq'

from src import biz
from src.wechat.api import WxManager
import sys
import json
import hashlib;


# 查询地推人员
sql_select_spread = """
select * from BS_Spread WHERE ACCOUNT=:account AND SPREAD_PWD=:pwd
"""

# 新个人地推
sql_insert_spread_person = """
INSERT INTO BS_Spread(SPREAD_NAME, SPREAD_PWD, SPREAD_TEL, BANK_ACCOUNT, BANK_NAME, SPREAD_KIND, CREATE_TIME)VALUES(:personName, :personPwd, :personTel, '13564364346', :bankName,'2', NOW())
"""

# 新增商家地推
sql_insert_spread_seller = """
INSERT INTO BS_Spread(SPREAD_NAME, SPREAD_PWD, SPREAD_SHOP, SPREAD_TEL, SPREAD_WECHAT, REMARK, SPREAD_TYPE, CREATE_TIME)VALUES(:sellerName, :sellerPwd, :sellerShop, :sellerTel, :sellerWeixin, :remark, :sellType, NOW())
"""

# 插入对应二维码
sql_insert_twocode_img = """
UPDATE BS_Spread SET TWOCODE_IMG=:twocodeImg WHERE ID=:spreadId
"""
# 插入对应二维码和twoCodeId
sql_update_twocodeAndCodeId = """
UPDATE BS_Spread SET TWOCODE_IMG=:twocodeImg,TWOCODE_ID=:twoCodeIdNew WHERE ID=:spreadId
"""

# 查询账号对应的二维码
sql_select_spread_img = """
select TWOCODE_IMG as spread_img, SPREAD_NAME as spread_name from BS_Spread WHERE SPREAD_TEL=:spread_tel
"""

# 将新关注的用户绑定到地推人员
sql_insert_spread_msg = """
update BM_Client set SPREAD_ID=:spreadId WHERE ID=:clientId
"""

# 查询个人设置信息
sql_select_name_bank_shop = """
select ID AS id,SPREAD_NAME AS username ,BANK_ACCOUNT as bank_account, SPREAD_TEL AS spread_tel,BANK_NAME AS  bank_name,SPREAD_PWD AS  spread_pwd
from BS_Spread WHERE ID=:spread_id
"""

# 查询商家个人设置信息
sql_select_settingShop = """
select ID AS id,SPREAD_NAME AS username ,BANK_ACCOUNT as bank_account, SPREAD_TEL AS spread_tel,BANK_NAME AS  bank_name,SPREAD_SHOP AS spread_shop,SPREAD_PWD AS  spread_pwd,
SPREAD_SHOPADDRESS AS spread_shopaddress
from BS_Spread WHERE ID=:shop_id
"""

# 根据登陆ID修改个人银行卡信息
sql_edit_BankCardPerson = """
UPDATE BS_Spread SET
{% if bankAccount %} BANK_ACCOUNT=:bankAccount, {% endif %}
{% if bankName %} BANK_NAME=:bankName, {% endif %}
ACCOUNT_CHTIME = NOW() WHERE ID= :spread_id
"""
# 根据登陆ID修改商家店铺信息
sql_edit_Shopinfo = """
UPDATE BS_Spread SET
{% if spread_shop %} SPREAD_SHOP=:spread_shop, {% endif %}
{% if spread_shopaddress %} SPREAD_SHOPADDRESS=:spread_shopaddress, {% endif %}
ACCOUNT_CHTIME = NOW() WHERE ID= :shop_id
"""
# 根据登陆ID修改商家银行卡信息
sql_edit_BankCardShop = """
UPDATE BS_Spread SET
{% if bankAccount %} BANK_ACCOUNT=:bankAccount, {% endif %}
{% if bankName %} BANK_NAME=:bankName, {% endif %}
ACCOUNT_CHTIME = NOW() WHERE ID= :shop_id
"""
# 查询个人信息
sql_select_person = """

select BANK_ACCOUNT AS bankAccount,BANK_NAME AS bankName, SPREAD_NAME AS bankUserName from BS_Spread WHERE ID=:id
"""


# 根据登陆ID修改个人密码
sql_edit_PwdPerson = """
UPDATE BS_Spread SET
{% if newpassword %} SPREAD_PWD=:newpassword, {% endif %}
{% if pwd_md5 %} PWD_MD5=:pwd_md5, {% endif %}
ACCOUNT_CHTIME = NOW() WHERE ID= :spread_id
"""

# 根据登陆ID修改商家密码
sql_edit_PwdShop = """
UPDATE BS_Spread SET
{% if newpassword %} SPREAD_PWD=:newpassword, {% endif %}
{% if pwd_md5 %} PWD_MD5=:pwd_md5, {% endif %}
ACCOUNT_CHTIME = NOW() WHERE ID= :shop_id
"""
# 通过电话查询spread_id
sql_select_spread_id = """
SELECT ID FROM BS_Spread WHERE SPREAD_TEL=:spread_tel
"""

# 查询每月代言人成果金额
sql_select_money_performance_1 = """
SELECT SUM(orders.bottles)*0.5 AS m_earned, MONTH(orders.end_time) AS m_month, YEAR(orders.end_time) AS m_year
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id AND orders.end_time IS NOT NULL
GROUP BY m_year, m_month
ORDER BY orders.end_time DESC
"""

# 查询每月代言人成果人数
sql_select_persons_performance_1 = """
select COUNT(*) AS persons_num, MONTH(FIRST_TIME) AS c_month, YEAR(FIRST_TIME) AS c_year from BS_Client
WHERE SPREAD_ID=:spread_id AND FIRST_TIME>=(select DATE_ADD(FIRST_TIME,interval -day(FIRST_TIME)+1 day))
GROUP BY c_month, c_year
ORDER BY FIRST_TIME DESC
"""

# 查询每月地推人员成果金额
sql_select_money_performance_2 = """
select sum(orders.bottles)*0.005 AS m_earned, MONTH(orders.end_time) AS m_month, YEAR(orders.end_time) AS m_year
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID in (:spread_id,(SELECT ID FROM BS_Spread WHERE SPREAD_ATTACH=:spread_id))
AND orders.end_time IS NOT NULL
GROUP BY m_year, m_month
ORDER BY orders.end_time DESC
"""

# 查询每月地推人员成果人数
sql_select_persons_performance_2 = """
select COUNT(*) AS persons_num, MONTH(FIRST_TIME) AS c_month, YEAR(FIRST_TIME) AS c_year from BS_Client
WHERE SPREAD_ID in (:spread_id,(SELECT ID FROM BS_Spread WHERE SPREAD_ATTACH=:spread_id))
AND FIRST_TIME IS NOT NULL
GROUP BY c_month, c_year
ORDER BY FIRST_TIME DESC
"""

# 查询每月即饮商家成果金额
sql_select_money_performance_3 = """
select sum(orders.bottles)*0.005 AS m_earned, MONTH(orders.end_time) AS m_month, YEAR(orders.end_time) AS m_year
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time IS NOT NULL
GROUP BY m_year, m_month
ORDER BY orders.end_time DESC
"""

# 查询每月即饮商家成果人数
sql_select_persons_performance_3 = """
select COUNT(*) AS persons_num, MONTH(FIRST_TIME) AS c_month, YEAR(FIRST_TIME) AS c_year from BS_Client
WHERE SPREAD_ID=:spread_id
AND FIRST_TIME IS NOT NULL
GROUP BY c_month, c_year
ORDER BY FIRST_TIME DESC
"""

# 查询每月非即饮商家成果金额
sql_select_money_performance_4 = """
select COUNT(*)*1 AS m_earned, MONTH(FIRST_TIME) AS m_month, YEAR(FIRST_TIME) AS m_year from BS_Client
WHERE SPREAD_ID=:spread_id
AND FIRST_TIME IS NOT NULL
GROUP BY m_month, m_year
ORDER BY FIRST_TIME DESC
"""

# 查询每月非即饮商家成果人数
sql_select_persons_performance_4 = """
select COUNT(*) AS persons_num, MONTH(FIRST_TIME) AS c_month, YEAR(FIRST_TIME) AS c_year from BS_Client
WHERE SPREAD_ID=:spread_id
AND FIRST_TIME IS NOT NULL
GROUP BY c_month, c_year
ORDER BY FIRST_TIME DESC
"""

# 查询代言人主页面主要信息
sql_select_all_msgs1 = """
select COUNT(*) AS all_persons,
sum(case when FIRST_TIME>=DATE_ADD(curdate(),interval -day(curdate())+1 day) then 1 else 0 end ) AS month_persons,
(select sum(orders.bottles)*0.500
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time>=(select DATE_ADD(curdate(),interval -day(curdate())+1 day))) AS month_earned,
(select sum(orders.bottles)*0.500
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id) AS all_earned,
(SELECT sum(orders.bottles)
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id AND orders.end_time>=DATE_ADD(curdate(),interval -day(curdate())+1 day)) as bottles
from BS_Client where SPREAD_ID=:spread_id AND IS_EFFECT='0'
"""

# 查询内部地推人员主页面主要信息
sql_select_all_msgs2 = """
select COUNT(*) AS all_persons,
sum(case when FIRST_TIME>=DATE_ADD(curdate(),interval -day(curdate())+1 day) then 1 else 0 end ) AS month_persons,
(select sum(orders.bottles)*0.005
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID in (SELECT ID FROM BS_Spread WHERE SPREAD_ATTACH=:spread_id) or spread_id
AND orders.end_time>=DATE_ADD(curdate(),interval -day(curdate())+1 day)) AS month_earned,
(select sum(orders.bottles)*0.005
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID in (SELECT ID FROM BS_Spread WHERE SPREAD_ATTACH=:spread_id) or :spread_id
AND orders.end_time IS NOT NULL) AS all_earned,
(SELECT sum(orders.bottles)
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID in (SELECT ID FROM BS_Spread WHERE SPREAD_ATTACH=:spread_id) or :spread_id
AND orders.end_time>=DATE_ADD(curdate(),interval -day(curdate())+1 day)) as bottles
from BS_Client where SPREAD_ID=:spread_id
"""

# 查询即饮商家主页面主要信息
sql_select_all_msgs3 = """
select COUNT(*) AS all_persons,
COUNT(*)*0+(select sum(orders.bottles)*0.005
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time IS NOT NULL) AS all_earned,
sum(case when FIRST_TIME>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id) then 1 else 0 end ) AS month_persons,
sum(case when FIRST_TIME>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id) then 1 else 0 end )*0+(select sum(orders.bottles)*0.005
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id)) AS month_earned,
(SELECT sum(orders.bottles)
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id AND orders.end_time>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id)) as bottles,
(SELECT FULL_MONEY FROM BS_Spread WHERE ID=:spread_id) AS clear_money
from BS_Client where SPREAD_ID=:spread_id AND IS_EFFECT='0'
"""

# 查询非即饮商家主页面主要信息
sql_select_all_msgs4 = """
select COUNT(*) AS all_persons,
COUNT(*)*2.000+(case when (select sum(orders.bottles)*0
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time IS NOT NULL) is not null then (select sum(orders.bottles)*0
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time IS NOT NULL) else 0 end) AS all_earned,
sum(case when FIRST_TIME>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id) then 1 else 0 end ) AS month_persons,
sum(case when FIRST_TIME>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id) then 1 else 0 end )*2.000+(case when (select sum(orders.bottles)*0
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id)) is not null then (select sum(orders.bottles)*0
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id
AND orders.end_time>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id)) else 0 end) AS month_earned,
(SELECT sum(orders.bottles)
FROM bs_order orders
INNER JOIN BS_Client client ON client.ID=orders.id
WHERE client.SPREAD_ID=:spread_id AND orders.end_time>=(SELECT CLEAR_TIME from BS_Spread WHERE ID=:spread_id)) as bottles,
(SELECT FULL_MONEY FROM BS_Spread WHERE ID=:spread_id) AS clear_money
from BS_Client where SPREAD_ID=:spread_id AND IS_EFFECT='0'
"""

# 商家本期清零
sql_update_clear = """
update BS_Spread SET CLEAR_TIME=NOW() WHERE ID=:spread_id
"""
# 查询商家清零条件
sql_select_clear_condition = """
select FULL_MONEY FROM BS_Spread WHERE ID=:spread_id
"""

# 查询个人信息
sql_select_my_msg = """
SELECT SPREAD_NAME s_name, BANK_ACCOUNT b_account, BANK_NAME b_name
FROM BS_Spread WHERE SPREAD_TEL=:spread_tel
"""

# 个人注册
sql_update_person = """
UPDATE BS_Spread SET SPREAD_TEL=:spread_tel,SPREAD_PWD=:spread_pwd,BANK_ACCOUNT=:bank_account,BANK_NAME=:bank_name,SPREAD_NAME=:bankCardUsername,SPREAD_KIND='2',PWD_MD5 =:pwd_md5,CREATE_TIME = NOW(),SPREAD_OPENID =:open_id,REGISTERED_TIME =NOW()
WHERE TWOCODE_ID=:twoCode_id
"""
#没有二维码的个人注册
sql_insert_person = """
INSERT INTO BS_Spread(SPREAD_TEL,SPREAD_PWD,BANK_ACCOUNT,BANK_NAME,SPREAD_NAME,SPREAD_KIND,PWD_MD5,CREATE_TIME,SPREAD_OPENID,REGISTERED_TIME)
VALUES(:spread_tel,:spread_pwd,:bank_account,:bank_name,:bankCardUsername,'1',:pwd_md5,NOW(),:open_id,NOW())
"""

# 查询个人地推账号的详细信息
sql_select_person = """
SELECT SPREAD_TEL,BANK_ACCOUNT,BANK_NAME,SPREAD_NAME FROM BS_Spread WHERE SPREAD_TEL =:spread_tel
"""

# 查询二维码是不是存在
sql_select_twoCode = """
SELECT TWOCODE_ID FROM BS_Spread WHERE TWOCODE_ID =:twoCode
"""

# 查询该商家上线地推人员
sql_select_highlines = """
SELECT SPREAD_ID FROM BS_Client WHERE OPEN_ID=:open_id
"""

# 商铺注册
sql_update_registerForShop = """
UPDATE BS_Spread SET SPREAD_TEL=:phoneNumber,SPREAD_PWD=:password,BANK_ACCOUNT=:bankId,BANK_NAME=:selectBank,
SPREAD_NAME=:bankCardUsername,SPREAD_SHOPADDRESS=:shopAddress,SPREAD_SHOP=:shopName,SPREAD_KIND=:shoptype,
PWD_MD5=:pwd_md5,CREATE_TIME = NOW(),SPREAD_ATTACH=:spread_attach,SPREAD_OPENID =:open_id,REGISTERED_TIME=NOW()
WHERE TWOCODE_ID =:twoCode
"""
# 查询商铺信息
sql_select_registerForShop = """
SELECT SPREAD_TEL,SPREAD_NAME,BANK_ACCOUNT,BANK_NAME,SPREAD_SHOP,SPREAD_SHOPADDRESS FROM BS_Spread WHERE SPREAD_TEL=:phoneNumber
"""

# 查询地推类型
sql_select_spread_kind = """
SELECT SPREAD_KIND FROM BS_Spread WHERE ID=:spread_id
"""

#查询二维码是否有被使用
sql_select_twoCodeUsed = """
SELECT SPREAD_TEL FROM BS_Spread WHERE TWOCODE_ID=:twoCode
"""
#查询twoCodeID
sql_select_twoCodeId = """
SELECT TWOCODE_ID FROM BS_Spread WHERE TWOCODE_ID LIKE 'P%' order by TWOCODE_ID desc LIMIT 1
"""
#验证账号密码
sql_check = """
SELECT * FROM BS_Spread WHERE SPREAD_TEL=:spread_tel AND PWD_MD5=:pwd_md5
"""
#查询账号
sql_select_tel = """
SELECT * FROM BS_Spread WHERE SPREAD_TEL=:spread_tel
"""
#更新密码
sql_update_pwd = """
UPDATE BS_Spread SET SPREAD_PWD=:spread_newPwd,PWD_MD5=:pwd_md5 WHERE SPREAD_TEL=:spread_tel
"""
#查询是否twocode_id已存在
sql_select_exist_twocodeid = """
SELECT * FROM BS_Spread WHERE TWOCODE_ID=:twocode_id
"""

sql_select_phoneNum = """
SELECT * FROM BS_Spread WHERE SPREAD_TEL =:phoneNum
"""
# 查询OpenId
sql_select_open_id = """
SELECT * FROM BS_Spread WHERE SPREAD_OPENID =:openId
"""




class spread(biz.Biz):
    def __init__(self):
        return

    def add_spread_person(self, personName, personPwd, personTel, personBank, bankName):
        """
        新增个人地推
        @:param
        @:return
        """
        try:
            msg = self.executeSql(sql_insert_spread_person, personName=personName, personPwd=personPwd,
                                  personTel=personTel, personBank=personBank, bankName=bankName).lastrowid
        except Exception, e:
            return None
        return msg

    def add_spread_seller(self, sellerName, sellerPwd, sellerShop, sellerTel, sellerWeixin, remark, sellType):
        """
        新增商家地推
        @:param
        @:return
        """
        try:

            msg = self.executeSql(sql_insert_spread_seller, sellerName=sellerName, sellerPwd=sellerPwd,
                                  sellerShop=sellerShop, sellerTel=sellerTel, sellerWeixin=sellerWeixin, remark=remark,
                                  sellType=sellType).lastrowid
        except Exception, e:
            return None
        return msg

    def addQRCode(self, twocodeImg, spreadId):
        """
        添加二维码给地推人员
        :param twocodeImg:
        :param spreadId:
        :return:
        """
        try:

            self.executeSql(sql_insert_twocode_img, twocodeImg=twocodeImg, spreadId=spreadId).rowcount
        except Exception, e:
            print e
            return None

    def select_spread(self, account, pwd):
        try:
            msg = self.executeSql(sql_select_spread, account=account, pwd=pwd).one()
        except Exception, e:
            return None
        return msg

    def select_spread_img(self, spread_tel):
        """
        查询地推人员二维码
        :param username:
        :return:
        """
        try:
            spread_msg = self.executeSql(sql_select_spread_img, spread_tel=spread_tel).first()
        except Exception, e:
            return None
        return spread_msg

    def insert_spread_msg(self, spreadId, clientId):
        """
        将地推人员信息绑定到新增用户
        :param spreadId:
        :param clientId:
        :return:
        """
        try:
            self.executeSql(sql_insert_spread_msg, spreadId=spreadId, clientId=clientId).rowcount
        except Exception, e:
            return None
        return None

    def select_clientid_by_openid(self, openId):
        """
        根据openid查询用户clientid
        :param openId:
        :return:
        """

        try:
            clientId = self.executeSql(sql_insert_spread_msg, openId=openId).one()
        except Exception, e:
            print e
            return None
        return clientId

    def select_name_bank_shop(self, spread_id):
        """
        根据电话查询个人的姓名，银行卡号，商铺名
        :param spread_tel:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_name_bank_shop, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msgs

    def select_settingShop(self, shop_id):
        """
        根据商家ID查询商铺的电话，姓名，银行卡号，商铺名，商铺地址
        :param shop_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_settingShop, shop_id=shop_id).first()
        except Exception, e:
            print e
            return None
        return msgs

    def select_BankCardPerson(self, spread_id):
        """
       根据登陆ID获得要修改的个人银行卡信息
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_name_bank_shop, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msgs

    def select_BankCardShop(self, shop_id):
        """
        根据登陆ID获得要修改的商家银行卡信息
        :param shop_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_settingShop, shop_id=shop_id).first()
        except Exception, e:
            print e
            return None
        return msgs

    def select_ShopInfo(self, shop_id):
        """
        根据登陆ID获得要修改的商家店铺，地址信息
        :param shop_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_settingShop, shop_id=shop_id).first()
        except Exception, e:
            print e
            return None
        return msgs



    def edit_PwdPerson(self, spread_id, newpassword,pwd_md5):
        """
        根据登陆ID个人密码修改
        :param :spread_id
        :return:
        """
        try:
            msg = self.executeSql(sql_edit_PwdPerson, spread_id=spread_id, newpassword=newpassword,pwd_md5=pwd_md5).rowcount
        except Exception, e:
            print e
            return None
        return msg

    def edit_PwdShop(self, shop_id, newpassword,pwd_md5):
        """
        根据登陆ID商家密码修改
        :param :shop_id
        :return:
        """
        try:
            msg = self.executeSql(sql_edit_PwdShop, shop_id=shop_id, newpassword=newpassword,pwd_md5=pwd_md5).rowcount
        except Exception, e:
            print e
            return None
        return msg

    def edit_BankCardPerson(self, spread_id, bankAccount, bankName):
        """
        根据登陆ID修改个人银行卡信息
        :param :spread_id
        :return:
        """
        try:
            msg = self.executeSql(sql_edit_BankCardPerson, spread_id=spread_id, bankAccount=bankAccount,
                                  bankName=bankName,
                                  ).rowcount
        except Exception, e:
            print e
            return None
        return msg

    def edit_Shopinfo(self, shop_id, spread_shop, spread_shopaddress):
        """
        根据登陆ID修改商家的 店铺，地址修改
        :param :shop_id
        :return:
        """
        try:
            msg = self.executeSql(sql_edit_Shopinfo, shop_id=shop_id, spread_shop=spread_shop,
                                  spread_shopaddress=spread_shopaddress,
                                  ).rowcount
        except Exception, e:
            print e
            return None
        return msg

    def edit_editBankCardShop(self, shop_id, bankAccount, bankName):
        """
        根据登陆ID修改商家银行卡信息
        :param :shop_id
        :return:
        """
        try:
            msg = self.executeSql(sql_edit_BankCardShop, shop_id=shop_id, bankAccount=bankAccount,
                                  bankName=bankName,
                                  ).rowcount
        except Exception, e:
            print e
            return None
        return msg

    def select_person(self, loginid):
        """
        获取要编辑个人信息
        @:param
        @:return
        """
        data = self.executeSql(sql_select_person, id=loginid).all()
        print data
        return data

    def select_spread_id(self, spread_tel):
        """
        查询spreadID
        :param spread_tel:
        :return:
        """
        try:
            spread_id = self.executeSql(sql_select_spread_id, spread_tel=spread_tel).one()
        except Exception, e:
            print e
            return None
        return spread_id


    def select_all_msgs1(self, spread_id):
        """
        统计此地推人员本月的下线人数
        :param spread_tel:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_all_msgs1, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msgs



    def select_all_msgs2(self, spread_id):
        """
        查询即饮商户在主页面显示的成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_all_msgs2, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msgs

    def select_all_msgs4(self, spread_id):
        """
        查询非即饮商户在主页面显示的成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_all_msgs4, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msgs

    def select_all_msgs3(self, spread_id):
        """
        查询即饮商户在主页面显示的成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_all_msgs3, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msgs


    def clear(self, spread_id):
        """
        商家本期清零
        :param spread_id:
        :return:
        """
        try:
            msg = self.executeSql(sql_update_clear, spread_id=spread_id).first()
        except Exception, e:
            print e
            return None
        return msg


    def clear_condition(self, spread_id):
        """
        商家本期清零条件
        :param spread_id:
        :return:
        """
        try:
            msg = self.executeSql(sql_select_clear_condition, spread_id=spread_id).one()
        except Exception, e:
            print e
            return None
        return msg

    def select_all_performance_1(self, spread_id):
        """
        查询每月地推成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_money_performance_1, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs

    def select_persons_performance_1(self, spread_id):
        """
        查询每月地推成果人数
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_persons_performance_1, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs



    def select_all_performance_2(self, spread_id):
        """
        查询每月地推成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_money_performance_2, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs

    def select_persons_performance_2(self, spread_id):
        """
        查询每月地推成果人数
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_persons_performance_2, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs


    def select_all_performance_3(self, spread_id):
        """
        查询每月地推成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_money_performance_3, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs

    def select_persons_performance_3(self, spread_id):
        """
        查询每月地推成果人数
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_persons_performance_3, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs


    def select_all_performance_4(self, spread_id):
        """
        查询每月地推成果
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_money_performance_4, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs

    def select_persons_performance_4(self, spread_id):
        """
        查询每月地推成果人数
        :param spread_id:
        :return:
        """
        try:
            msgs = self.executeSql(sql_select_persons_performance_4, spread_id=spread_id).all()
        except Exception, e:
            print e
            return None
        return msgs


    def insert_person(self, towCode_id, spread_tel, spread_pwd, bank_account, bank_name, bankCardUsername,pwd_md5,open_id):
        """
        个人注册地推
        :return:
        """
        #注册新个人地推
        twoCodeIdNew = ''
        twoCodeIng = ''
        obj = WxManager()
        if towCode_id:
            self.executeSql(sql_update_person,twoCode_id=towCode_id,spread_tel=spread_tel,spread_pwd=spread_pwd,bank_account=bank_account,bank_name=bank_name,bankCardUsername=bankCardUsername,pwd_md5=pwd_md5,open_id=open_id)
        else:
            self.executeSql(sql_insert_person,spread_tel=spread_tel,spread_pwd=spread_pwd,bank_account=bank_account,bank_name=bank_name,bankCardUsername=bankCardUsername,pwd_md5=pwd_md5,open_id=open_id)
            spreadId = self.executeSql(sql_select_spread_id,spread_tel=spread_tel).one()
            twoCodeIdOld = self.executeSql(sql_select_twoCodeId).one()
            if twoCodeIdOld:
                Numb = int(twoCodeIdOld[1:9])+1
                for i in range(0,8-len(str(Numb))):
                    twoCodeIng = twoCodeIng + '0'
                twoCodeIdNew = "P%s%d"%(twoCodeIng,Numb)
            else:
                twoCodeIdNew = "P00000001"
            twocodeImg = obj.get_twocode(obj.get_Ticket(obj.get_AccessToken(), str(spreadId)))
            self.executeSql(sql_update_twocodeAndCodeId,spreadId=spreadId,twocodeImg=twocodeImg,twoCodeIdNew=twoCodeIdNew)
        #检索返回这个地推信息
        msg = self.executeSql(sql_select_person,spread_tel = spread_tel).all()

        return msg


    def insert_registerForShop(self,phoneNumber,password,bankId,selectBank,bankCardUsername,shopAddress,shopName,shoptype,twoCode,pwd_md5,open_id):
        """
        商家注册地推
        :param phoneNumber:
        :param password:
        :param bankId:
        :param selectBank:
        :param bankCardUsername:
        :param shopAddress:
        :param shopName:
        :param shoptype:
        :return:
        """

        # 查询该商铺的上线地推人员ID
        spread_attach = self.executeSql(sql_select_highlines, open_id=open_id).one()

        #注册新商铺地推
        self.executeSql(sql_update_registerForShop, phoneNumber=phoneNumber, password=password, bankId=bankId,
                        selectBank=selectBank, bankCardUsername=bankCardUsername, shopAddress=shopAddress,
                        shopName=shopName, shoptype=shoptype, twoCode=twoCode, pwd_md5=pwd_md5,
                        spread_attach=spread_attach, open_id=open_id)

        #检索返回这个地推信息
        msg = self.executeSql(sql_select_registerForShop,phoneNumber=phoneNumber).all()

        return msg

    def select_twoCode(self, twoCode):
        """
        查询二维码
        1.已经被注册。0.可以注册。2.没有注册二维码
        :param twoCode:
        :return:
        """
        msg = self.executeSql(sql_select_twoCode, twoCode=twoCode).all()
        msg2 = self.executeSql(sql_select_twoCodeUsed,twoCode=twoCode).all()

        if msg and msg2[0]['SPREAD_TEL'] != None and msg2[0]['SPREAD_TEL'] != '':
            num = '1'
        elif msg:
            num = '0'
        else:
            num = '2'

        return num

    def select_spread_kind(self, spread_id):
        """查询地推类型"""
        try:
            msgs = self.executeSql(sql_select_spread_kind, spread_id=spread_id).one()
        except Exception, e:
            print e
            return None
        return msgs
    def sql_check(self,spread_tel,pwd_md5):
        """
        验证账号密码
        :param spread_tel:
        :param spread_pwd:
        :return:
        """
        msg = self.executeSql(sql_check,spread_tel=spread_tel,pwd_md5=pwd_md5).rowcount
        return msg

    def newPwd(self,spread_tel,spread_newPwd,pwd_md5):
        """
        验证有没有电话，然后更新密码
        :return:
        """
        msg = self.executeSql(sql_select_tel,spread_tel=spread_tel).rowcount
        if msg == 1:
            msg2 = self.executeSql(sql_update_pwd,spread_newPwd=spread_newPwd,spread_tel=spread_tel,pwd_md5=pwd_md5).rowcount
            return msg2
        else:
            return msg


    def select_exist_twocodeid(self, twocode_id):
        msg = self.executeSql(sql_select_exist_twocodeid, twocode_id=twocode_id).first()
        return  msg

    def select_spread_phoneNum(self,phoneNum):
        msg = self.executeSql(sql_select_phoneNum,phoneNum=phoneNum).rowcount
        return msg

    def select_spread_openId(self,openId):
        msg = self.executeSql(sql_select_open_id,openId=openId).all()
        return msg