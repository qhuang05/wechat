#!/usr/local/bin/python
#-*- coding:utf-8 -*-
# Author: jacky
# Time: 14-2-22 下午11:48
# Desc: 短信http接口的python代码调用示例
import httplib
import urllib

#服务地址
host = "yunpian.com"
#端口号
port = 80
#版本号
version = "v1"
#查账户信息的URI
user_get_uri = "/" + version + "/user/get.json"
#智能匹配模版短信接口的URI
sms_send_uri = "/" + version + "/sms/send.json"
#模板短信接口的URI
sms_tpl_send_uri = "/" + version + "/sms/tpl_send.json"
#语音验证码
sms_voice_uri = "/" + version + "/voice/send.json"

def get_user_info(apikey):
    """
    取账户信息
    """
    conn = httplib.HTTPConnection(host, port=port)
    conn.request('GET', user_get_uri + "?apikey=" + apikey)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

def send_voice_sms(apikey, code, mobile):
    params = urllib.urlencode({'apikey': apikey,'code':code, 'mobile':mobile})
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
    conn = httplib.HTTPConnection(host, port=port, timeout=30)
    conn.request("POST", sms_voice_uri, params, headers)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

def send_sms(apikey, text, mobile):
    """
    能用接口发短信
    """
    params = urllib.urlencode({'apikey': apikey, 'text': text, 'mobile':mobile})
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
    conn = httplib.HTTPConnection(host, port=port, timeout=30)
    conn.request("POST", sms_send_uri, params, headers)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

def tpl_send_sms(apikey, tpl_id, tpl_value, mobile):
    """
    模板接口发短信
    """
    params = urllib.urlencode({'apikey': apikey, 'tpl_id':tpl_id, 'tpl_value': tpl_value, 'mobile':mobile})
    headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
    conn = httplib.HTTPConnection(host, port=port, timeout=30)
    conn.request("POST", sms_tpl_send_uri, params, headers)
    response = conn.getresponse()
    response_str = response.read()
    conn.close()
    return response_str

def send_sms_check(checkNumber,phoneNumber):
    apikey = "9a09b634c8cc4f45f767d393b5609312"
    mobile = phoneNumber
    text = "【玩啤科技】您的验证码为"+str(checkNumber)+",请在1分钟内正确输入，如不是本人操作，请忽略本短信"
    print phoneNumber,mobile
    #查账户信息
    print(get_user_info(apikey))
    #调用智能匹配模版接口发短信
    print(send_sms(apikey, text, mobile))
    #调用模板接口发短信
    # tpl_id = 1038351 #对应的模板内容为：您的验证码是#code#【#company#】
    # tpl_value = '#code#='+checkNumber+'&#min#=1'
    # print(tpl_send_sms(apikey, tpl_id, tpl_value, mobile))

def send_voice_check(phoneNumber,codeNum):
    """
    :param phoneNumber: 电话号码
    :param codeNum: 验证码，数字Only
    :return:
    """
    apikey = "9a09b634c8cc4f45f767d393b5609312"
    mobile = phoneNumber
    code = codeNum
    #查账户信息
    print(get_user_info(apikey))
    #语音验证码
    print(send_voice_sms(apikey, code, mobile))


