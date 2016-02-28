#!/usr/bin/env python
# -*- coding: utf-8 -*-


from src import biz
from urllib import urlencode, quote
from src.wechat.api import WxManager
import urllib2
import json
import time

__author__ = 'bac'


#新增关注客户
sql_insert_client_by_add="""
INSERT INTO BM_Client( CLIENT_OPENID, SPREAD_ID, CLIENT_TIME)VALUES(:openid, :parameter, NOW())
"""

# 地推下线关系绑定
sql_insert_bsclient = """
INSERT INTO BS_Client(OPEN_ID, SPREAD_ID, FIRST_TIME, CHECK_TIME)VALUES(:openid, :parameter, NOW(), CURTIME())
"""

#客户是否存在（根据openid查询）
sql_select_client_by_clientid="""
SELECT ID FROM BM_Client WHERE CLIENT_OPENID=:openid
"""

#客户是否关注，状态更新
sql_update_client_by_attentionstatus="""
UPDATE BM_Client SET ATTENTION_STATUS=:attentionstatus WHERE CLIENT_OPENID=:openid
"""

#客户取消关注更新BS_Client
sql_update_bsclient_by_effect = """
UPDATE BS_Client SET IS_EFFECT=:is_effect WHERE OPEN_ID=:openid
"""

#首次关注发放代金券
sql_insert_wallet = """
INSERT INTO BM_Wallet(CLIENT_ID, WALLET_TYPE, WALLET_MONEY, USE_STATUS, CREATE_TIME, EFFECTIVENESS_TIME, USE_TYPE)
VALUES ((SELECT ID FROM BM_Client WHERE CLIENT_OPENID=:open_id), :wallet_type, :wallet_money, :use_status, NOW(), (SELECT DATE_ADD(NOW(),INTERVAL 15 DAY)), '01')
"""

# 关注时间段获取
sql_select_by_spread_time = """
SELECT DATE_FORMAT(M_S_TIME, '%H%i') AS mstime,
    DATE_FORMAT(M_E_TIME, '%H%i') AS metime,
    DATE_FORMAT(A_S_TIME,'%H%i') AS astime,
    DATE_FORMAT(A_E_TIME,'%H%i') AS aetime,
    DATE_FORMAT(N_S_TIME,'%H%i') AS nstime,
    DATE_FORMAT(N_E_TIME,'%H%i') AS netime,
    DATE_FORMAT(S_S_TIME,'%H%i') AS sstime,
    DATE_FORMAT(S_E_TIME,'%H%i') AS setime,
    TIMESTATUS AS timestatus FROM BS_Spread WHERE ID=:parameter
"""


class wxnews(biz.Biz):

    def wxusername(self, openid):
        """
        微信昵称获取
        20150725 注释 McShal
        @:param openid
        @:return
        """
        try:
            biz = WxManager()
            token = biz.get_AccessToken()   #token获取

            nickname = biz.get_wxuserinfo(token, openid)  #获取微信昵称


        except Exception, e:
            print e
            return None

        return nickname



    def twocodenewsn(self, openid, parameter):
        """
        二维码扫码(未关注)
        @:param  openid
        @:param  parameter
        @:return
        """
        try:
            nowtime = int(time.strftime('%H%M',time.localtime(time.time())))
            parameter=parameter[8:]
            if parameter == '' or parameter == None:
                parameter = 0

            clientid = self.executeSql(sql_select_client_by_clientid, openid=openid).one()


            spreadtime = self.executeSql(sql_select_by_spread_time, parameter=parameter).all()

            """
            20151230
            超级代言人（地推功能）
            关注时间判断
            """
            if spreadtime:
                timestatus = spreadtime[0]['timestatus']
                #早上
                if spreadtime[0]['mstime'] == None:
                    mstime=0
                else:
                    mstime = int(spreadtime[0]['mstime'])
                if spreadtime[0]['metime'] ==None:
                    metime=0
                else:
                    metime = int(spreadtime[0]['metime'])
                #中午
                if spreadtime[0]['astime'] ==None:
                    astime=0
                else:
                    astime = int(spreadtime[0]['astime'])

                if spreadtime[0]['aetime'] ==None:
                    aetime = 0
                else:
                    aetime = int(spreadtime[0]['aetime'])
                #晚上
                if spreadtime[0]['nstime'] == None:
                    nstime = 0
                else:
                    nstime = int(spreadtime[0]['nstime'])

                if spreadtime[0]['netime'] ==None:
                    netime=0
                else:
                    netime = int(spreadtime[0]['netime'])
                #宵夜
                if spreadtime[0]['sstime'] == None:
                    sstime = 0
                else:
                    sstime = int(spreadtime[0]['sstime'])
                if spreadtime[0]['setime'] == None:
                    setime=0
                else:
                    setime = int(spreadtime[0]['setime'])

            if clientid:
                count_row = 0
                res=self.executeSql(sql_update_client_by_attentionstatus, attentionstatus='0', openid=openid).rowcount  #已关注后，取消关注状态修改
            else:
                #res = self.executeSql(sql_insert_client_by_add, nickname=nickname, openid=openid, parameter=parameter).rowcount
                if parameter == None:
                    res = self.executeSql(sql_insert_client_by_add, openid=openid, parameter=parameter).rowcount
                else:
                    res1 = self.executeSql(sql_insert_client_by_add, openid=openid, parameter=parameter).rowcount

                    #时间状态校验
                    if timestatus == '1':
                        #带参数关注时间校验
                        if mstime!=0 or mstime!=None:
                            if(nowtime>= mstime and nowtime<=metime):
                                res2 = self.executeSql(sql_insert_bsclient, openid=openid, parameter=parameter).rowcount
                        if astime != 0 or astime != None:
                            if(nowtime>= astime and nowtime<=aetime):
                                res2 = self.executeSql(sql_insert_bsclient, openid=openid, parameter=parameter).rowcount
                        if nstime != 0 or nstime != None:
                            if nowtime >= nstime and nowtime <= netime:
                                res2 = self.executeSql(sql_insert_bsclient, openid=openid, parameter=parameter).rowcount
                        if sstime == 0 or sstime != None:
                            if(nowtime>=sstime and nowtime <= setime):
                                res2 = self.executeSql(sql_insert_bsclient, openid=openid, parameter=parameter).rowcount
                    else:
                        res2 = self.executeSql(sql_insert_bsclient, openid=openid, parameter=parameter).rowcount

                row1 = self.executeSql(sql_insert_wallet, open_id=openid, wallet_type='02', wallet_money=50,
                                      use_status='02').rowcount     #首次关注时为用户插入代金券
                row2 = self.executeSql(sql_insert_wallet, open_id=openid, wallet_type='02', wallet_money=30,
                                      use_status='02').rowcount     #首次关注时为用户插入代金券
                row3 = self.executeSql(sql_insert_wallet, open_id=openid, wallet_type='02', wallet_money=20,
                                      use_status='02').rowcount     #首次关注时为用户插入代金券
                count_row = row1 + row2 + row3

        except Exception, e:
            print e

        return count_row


    def twocodenewsy(self, openid, parameter):
        """
        二维码扫码(带参数)
        @:param openid
        @:param parameter
        @:return
        """
        try:
            clientid = self.executeSql(sql_select_client_by_clientid, openid=openid).one()

            if clientid:
                res=self.executeSql(sql_update_client_by_attentionstatus, attentionstatus='0', openid=openid).rowcount  #已关注后，取消关注状态修改
            else:
                res=self.executeSql(sql_insert_client_by_add, openid=openid, parameter=parameter).rowcount  #未关注，新增客户

            print res

        except Exception, e:
            print e
        return None


    def unsubscribe(self, openid):
        """
        取消关注
        @:param openid
        @:return
        """
        try:
            res = self.executeSql(sql_update_client_by_attentionstatus, attentionstatus='01', openid=openid).rowcount
            res2 = self.executeSql(sql_update_bsclient_by_effect, is_effect='01', openid=openid).rowcount
            print res
        except Exception, e:
            print e
        return None


    def meunclick(self, parameter):
        """
        菜单事件推送
        @:param  eventkey parameter
        @:return xml_str   400-85－999
        """

        if parameter=='about_01':
            reply = """在线下单:玩啤微信公众号下单平台，更多优惠(推荐)电话下单：400-859-9939"""
        elif parameter == 'about_02':
            reply = """【玩啤】配送服务区域已覆盖:厦门市思明区、湖里区。更多区域持续开发中，敬请期待。"""
        elif parameter == 'about_03':
            reply = """每日16:00-24:00, 20分钟配送到位。"""

        return reply


class location(biz.Biz):

    def bd_locationtoaddress(self, latitude, longitude):
        """
        使用百度地理编码获取当前地址
        @:param   latitude  纬度
        @:param   longitude 经度
        @:return  地址
        """
        try:
            opener = urllib2.build_opener(urllib2.HTTPHandler())

            url='http://api.map.baidu.com/geocoder/v2/?ak=O7cdvPTiPtGycHTuldlUwM9L&v&callback=renderReverse&location='+latitude+','+longitude+'&output=json&pois=0'

            response = opener.open(url).read()

            response = response[29:-1]

            address = json.loads(response)["result"]["formatted_address"]

        except Exception, e:
            print e

        return address


    def bd_addersstolocation(self, address):
        """
        使用百度地图接口，通过输入地址获取地理编码
        @:param   address 地址
        @:return JSON 百度地理编码
        """
        try:
            opener= urllib2.build_opener(urllib2.HTTPHandler())

            url='http://api.map.baidu.com/geocoder/v2/?ak=O7cdvPTiPtGycHTuldlUwM9L&v&callback=renderOption&output=json&address='+address+'&city=厦门市'

            response = opener.open(url).read()

            response = response[27:-1]

            location = json.loads(response)["result"]["location"]

        except Exception, e:
            print e
        return location



    def bd_routematrix(self, begin_longitude, begin_latitude, end_longitude, end_latitude):
        """
        baidu Web服务API
        输入出发地经纬度与目的地经纬度获取
        步行时间
        @:param   出发地经纬度   begin_longitude(经度)\begin_latitude(纬度)
        @:param   目的地经纬度   end_longitude(经度)\end_latitude(纬度)
        @:return  距离 value
        """
        try:
            opener = urllib2.build_opener(urllib2.HTTPHandler())

            url = 'http://api.map.baidu.com/direction/v1/routematrix?output=json&origins='+begin_latitude+','+begin_longitude+'&destinations='+end_latitude+','+end_longitude+'&mode=walking&tactics=11&coord_type=gcj02&ak=O7cdvPTiPtGycHTuldlUwM9L&v'

            response = opener.open(url).read()

            distance = json.loads(response)["result"]["elements"][0]["distance"]["value"]


        except Exception, e:
            print e
            return
        return distance



    def tx_addresstolocation(self, address):
        """
        使用腾讯web service api 接口调用地址解析(地址转坐标)
        @:param address 地址
        @:return JSON 腾讯地理编码
        """
        try:
            opener = urllib2.build_opener(urllib2.HTTPHandler())

            url='http://apis.map.qq.com/ws/geocoder/v1/?region=厦门市&address='+address+'&key=XFIBZ-GYL3F-YK7JL-JJCMQ-R3DK7-E2BPL'

            response = opener.open(url).read()

            location = json.loads(response)["result"]["location"]

        except Exception, e:
            print e
            return None
        return location





    def tx_locationtodistrict(self, latitude, longitude):
        """
        使用腾讯web service api 接口调用逆地理编码解析地址
        get_poi（是否返回周边POI列表：1.返回；0不返回(默认)
        @:param 经度
        @:param 纬度
        @:return district
        """
        try:
            opener = urllib2.build_opener(urllib2.HTTPHandler)

            url = 'http://apis.map.qq.com/ws/geocoder/v1/?location='+ latitude +','+ longitude +'&coord_type=5&key=XFIBZ-GYL3F-YK7JL-JJCMQ-R3DK7-E2BPL&get_poi=0'

            response = opener.open(url).read()

            district = json.loads(response)['result']['address_component']['district']

        except Exception, e:
            print e
            return None
        return district



    def tx_locationtoaddress(self, latitude, longitude):
        """
        使用腾讯web service api 接口调用逆地理编码解析地址
        get_poi（是否返回周边POI列表：1.返回；0不返回(默认)
        @:param 经度
        @:param 纬度
        @:return address
        """
        try:
            opener = urllib2.build_opener(urllib2.HTTPHandler)

            url = 'http://apis.map.qq.com/ws/geocoder/v1/?location='+ latitude +','+ longitude +'&coord_type=5&key=XFIBZ-GYL3F-YK7JL-JJCMQ-R3DK7-E2BPL&get_poi=0'

            response = opener.open(url).read()

            address = json.loads(response)['result']['formatted_addresses']['recommend']

            if address==None:
                address = json.loads(response)['result']['address_reference']['landmark_l2']['title']

        except Exception, e:
            print e
            return None

        return address

    def tx_oprition(self,address):
        """
        oprition
        :return:
        """
        try:
            opener = urllib2.build_opener(urllib2.HTTPHandler())

            url='http://apis.map.qq.com/ws/place/v1/suggestion?region=厦门市&keyword='+address+'&key=XFIBZ-GYL3F-YK7JL-JJCMQ-R3DK7-E2BPL'

            response = opener.open(url).read()
            location = json.loads(response)
        except Exception, e:
            print e
            return None
        return location




