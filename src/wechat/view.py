#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'bac'


import hashlib
import sys
from .import wxnews,location
from src.tools import JSON
from flask import g, request,  Blueprint
import xml.etree.ElementTree as ET

reload(sys)


sys.setdefaultencoding('UTF-8')

bp = Blueprint("wechat", __name__)



@bp.route("/weixin/getweixin", methods=["GET", 'POST'])
def getweixin():
    """
    GET: weixin 微信校验
    @:param signature(微信加密签名)
    @:param timestamp(时间戳)
    @:param nonce(随机数)
    @:param echostr(随机字符串)

    POST: 微信消息接入
    """

    if request.method == 'GET':
        signature = request.values.get('signature')
        timestamp = request.values.get('timestamp')
        nonce = request.values.get('nonce')
        echostr = request.values.get('echostr')

        token="beerwheretoplace"

        list =[token, timestamp, nonce] #字典序排列
        list.sort()

        sha1 = hashlib.sha1()  #hash加密
        map(sha1.update, list)
        hashcode=sha1.hexdigest()

        if hashcode == signature:   #如果来自微信请求，返回echostr
            return echostr
        else:
            return 'error'

    if request.method == 'POST':
        biz = wxnews()
        data = request.get_data()

        root = ET.fromstring(data)
        fromUser = root.findtext(".//FromUserName")
        toUser = root.findtext(".//ToUserName")
        CreateTime = root.findtext(".//CreateTime")
        MsgType = root.findtext(".//MsgType")
        Content = root.findtext(".//Content")

        print Content

        if MsgType=='text':
            reply='文本消息'
            #reply='''终于等到你啦，想喝酒了对不对？来，赶紧下单吧，20分钟没送到，任你玩弄。每天16:00-24:00是我的工作时间，其他时间我需要休息玩耍。对了，有事可以打我电话：400-859-9939，全球手工精酿啤酒让你跟我一样玩啤。'''

            """
            20151012 玩啤（百威音乐节）门票抽奖活动细则
            关闭
            """
            # if Content=='玩啤':
            #     title='''抢票攻略丨百威电波啤酒音乐节免费门票开送！玩啤带你嗨翻全场！！'''
            #     description ='''玩啤与你相约2015百威电波音乐节，释放你内心狂热的欢愉热情，与大海一醉方休！'''
            #     picUrl='''http://mmbiz.qpic.cn/mmbiz/e7mGTyJYvvyOsdYnLEibXaGuQ5ccUrfPoibB3aWYMeAzYQrDQ1uCkgSP9LbLlA5nDFvR7Lia4HzO1DHwCtLRI3Xow/640?wx_fmt=jpeg&tp=webp&wxfrom=5'''
            #     url='''http://mp.weixin.qq.com/s?__biz=MzAwOTY4MDMyMw==&mid=209351359&idx=1&sn=60cf3e1cd3da3c6de7e6a3508fbfc7cd#rd'''
            #     xml_str = '''
            #     <xml>
            #         <ToUserName>''' +fromUser+'''</ToUserName>
            #         <FromUserName>''' + toUser  + '''</FromUserName>
            #         <CreateTime>''' + CreateTime + '''</CreateTime>
            #         <MsgType><![CDATA[news]]></MsgType>
            #         <ArticleCount>1</ArticleCount>
            #         <Articles>
            #             <item>
            #                 <Title>'''+title+'''</Title>
            #                 <Description>'''+description+'''</Description>
            #                 <PicUrl><![CDATA[http://mmbiz.qpic.cn/mmbiz/e7mGTyJYvvyOsdYnLEibXaGuQ5ccUrfPoibB3aWYMeAzYQrDQ1uCkgSP9LbLlA5nDFvR7Lia4HzO1DHwCtLRI3Xow/640?wx_fmt=jpeg&tp=webp&wxfrom=5]]></PicUrl>
            #                 <Url><![CDATA[http://mp.weixin.qq.com/s?__biz=MzAwOTY4MDMyMw==&mid=209351359&idx=1&sn=60cf3e1cd3da3c6de7e6a3508fbfc7cd#rd]]></Url>
            #             </item>
            #         </Articles>
            #     </xml>'''
            #     return xml_str
            # else:

            # reply='''感谢您参加百威音乐节抢票活动，敬请关注10.12号玩啤发布的中奖名单，如中奖我们将与您联系~'''

            # xml_str='''
            # <xml>
            #     <ToUserName>''' + fromUser + '''</ToUserName>
            #     <FromUserName>''' + toUser  + '''</FromUserName>
            #     <CreateTime>''' + CreateTime + '''</CreateTime>
            #     <MsgType><![CDATA[text]]></MsgType>
            #     <Content>''' + reply + '''</Content>
            # </xml>'''
            # return xml_str

        elif MsgType == 'image':
            reply='图片消息'

        elif MsgType == 'voice':
            reply='语音信息'

        elif MsgType == 'video':
            reply = '视频信息'

        elif MsgType == 'location':
            reply = '地理消息'

        elif MsgType == 'link':
            reply = '链接消息'

        elif MsgType == 'event':
            Event=root.findtext(".//Event")

            if Event=='subscribe':        #关注
                parameter=root.findtext(".//EventKey")
                #nickname = biz.wxusername(fromUser)

                msg = biz.twocodenewsn(fromUser, parameter)

                reply = '''终于等到你啦，想喝酒了对不对？来，赶紧下单吧，20分钟没送到，任你玩弄。每天16:00-24:00是我的工作时间，其他时间我需要休息玩耍。对了，有事可以打我电话：400-859-9939，全球手工精酿啤酒让你跟我一样玩啤。'''

                reply_1st = '''\n\n您是首次关注用户，我们为您准备了有效期15天的三张代金券，赶快使用吧！'''

                if msg == 3:

                    xml_str = '''
                    <xml>
                        <ToUserName>''' + fromUser + '''</ToUserName>
                        <FromUserName>''' + toUser + '''</FromUserName>
                        <CreateTime>''' + CreateTime + '''</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content>''' + reply + reply_1st + '''</Content>
                    </xml>
                    '''
                else:
                    xml_str = '''
                    <xml>
                        <ToUserName>''' + fromUser + '''</ToUserName>
                        <FromUserName>''' + toUser + '''</FromUserName>
                        <CreateTime>''' + CreateTime + '''</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content>''' + reply + '''</Content>
                    </xml>
                    '''


            elif Event=='unsubscribe':           #取消关注
                biz.unsubscribe(fromUser)

                reply='取消关注'

            elif Event=='SCAN':                 #带参数二维码关注
                parameter = root.findtext(".//EventKey")
                biz.twocodenewsn(fromUser, parameter)
                # biz.twocodenewsy(fromUser, parameter)

                reply='''Hi, 感谢关注玩啤！\n\n初次见面，听我做个自我介绍吧 [呲牙]点击下方菜单 “玩啤”＞“关于我们”。\n\n想知道怎样找我叫酒 [啤酒] 点击下方菜单“玩啤”＞“新手指南”。\n\n当然，你也可以直接点击下方菜单“下单” [坏笑] 体验20分钟全岛送达的极致体验。\n\n欢迎你随时与我们互动，添加微信个人号“wantbeer1”即可。\n\nCheers！快来和我喝遍世界吧。[勾引]'''

                xml_str = '''
                <xml>
                    <ToUserName>''' + fromUser + '''</ToUserName>
                    <FromUserName>''' + toUser  + '''</FromUserName>
                    <CreateTime>''' + CreateTime + '''</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content>''' + reply + '''</Content>
                </xml>
                '''
            elif Event=='CLICK':         #菜单单机事件

                parameter = root.findtext(".//EventKey")
                reply = biz.meunclick(parameter)

                xml_str = '''
                <xml>
                    <ToUserName>''' + fromUser + '''</ToUserName>
                    <FromUserName>''' + toUser  + '''</FromUserName>
                    <CreateTime>''' + CreateTime + '''</CreateTime>
                    <MsgType><![CDATA[text]]></MsgType>
                    <Content>''' + reply + '''</Content>
                </xml>
                '''
            # elif Event =='VIEW':      #菜单 url事件
            #
            #     reply=''
        else:
            reply = "未知事件"

            xml_str = '''
                    <xml>
                        <ToUserName>''' + fromUser + '''</ToUserName>
                        <FromUserName>''' + toUser  + '''</FromUserName>
                        <CreateTime>''' + CreateTime + '''</CreateTime>
                        <MsgType><![CDATA[text]]></MsgType>
                        <Content>''' + reply + '''</Content>
                    </xml>
                    '''


        return xml_str


@bp.route("/weixin/gettxaddr", methods=["GET", "POST"])
def gettxaddr():
    """
    获取用户所在地址(腾讯)
    @:param  lat
    @:param  lon
    @:return address
    """
    latitude = request.values.get('latitude')
    longitude = request.values.get('longitude')

    biz = location()

    adderss = biz.tx_locationtoaddress(latitude, longitude)

    return adderss



@bp.route("/weixin/gettxlocation", methods=["GET", "POST"])
def gettxlocation():
    """
    获取用户所在省市县校验(腾讯)
    @:param
    @:param
    @:return district (区)
    """
    latitude = request.values.get('latitude')
    longitude = request.values.get('longitude')

    biz = location()

    district = biz.tx_locationtodistrict(latitude, longitude)           #返回所在区

    return district

@bp.route("/weixin/gettxaddress", methods=["GET", "POST"])
def gettxaddress():
    """
    获取微信上传地址(返回微信地理编码)
    @:param address
    @:return JSON latitude 纬度, longitude 经度
    """
    address = request.values.get('address')

    biz = location()

    locat = biz.tx_addresstolocation(address)

    res = JSON.dumps(locat)

    return res




@bp.route("/weixin/getlocation", methods=["GET", "POST"])
def getlocation():
    """
    获取微信当前地理编码（转百度地理编码）
    @:param latitude 纬度
    @:param longitude 经度
    @:return  当前地址
    """
    latitude = request.values.get('latitude')
    longitude = request.values.get('longitude')

    biz = location()

    adder = biz.bd_locationtoaddress(latitude, longitude)

    return adder


@bp.route("/weixin/gettextlocation", methods=["GET", "POST"])
def gettextlocation():
    """
    获取微信上传的地址（返回百度地理编码）
    @:param address
    @:return JSON latitude 纬度, longitude 经度
    """
    address = request.values.get('address')

    biz=location()

    locat = biz.bd_addersstolocation(address)

    res = JSON.dumps(locat)

    return res











