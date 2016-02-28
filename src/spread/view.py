#!/usr/bin/env python
# -*- coding: utf-8 -*-

__author__ = 'wq'

from flask import g, request, render_template, Blueprint, redirect ,session
from . import spread
from src.wechat.api import WxManager
from src.tools import JSON
import hashlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import random,string
from SendSMS import send_sms_check


bp = Blueprint("recursion", __name__)


@bp.route('/spread/loginSpread')
def loginuser():
    biz = spread()
    session['checkImgP'] = ''
    code = request.values.get('code')
    authorize = WxManager()
    openid = authorize.get_wxcode(code)
    session['open_id'] = openid
    # session['open_id'] = '432123456'
    msg = biz.select_spread_openId(openid)
    print msg

    return render_template('spread/loginForDt.html',msg=msg)



@bp.route('/spread/shareImg', methods=['GET', 'POST'])
def shareImg():
    """
    获取地推人员二维码用于分享
    :return:
    """

    if request.method == 'GET':
        biz = spread()
        spread_msg = biz.select_spread_img(session['spread_tel'])
    if request.values.get("flag") == '0':
        page = "spread/posterpage.html"
    if request.values.get("flag") == '1':
        page = "spread/my_qrcode.html"
    return render_template(page, spread_msg=spread_msg)



@bp.route('/spread/settings', methods=['GET', 'POST'])
def settings():
    """
    个人信息设置
    :return:
    """
    if request.method == 'GET':

        biz = spread()
        data = biz.select_name_bank_shop(session['spread_id'])
        print data
        return render_template('/spread/settings.html', data=data)



@bp.route('/spread/settingShop', methods=['GET', 'POST'])
def settingShop():
    """
    商家信息设置
    :return:
    """
    if request.method == 'GET':
        biz = spread()
        data = biz.select_settingShop(session['spread_id'])
        print data
        return render_template('/spread/settingShop.html', data=data)



@bp.route('/spread/personPwdPage', methods=['GET', 'POST'])
def personPwdPage():
    """
    个人密码修改页面
    :return:
    """
    msg = ''
    spread_pwd=''
    if request.method == 'POST':
        spread_pwd = request.form.get('spread_pwd')

    return render_template('/spread/editPwdPerson.html',spread_pwd=spread_pwd)



@bp.route('/spread/shopPwdPage', methods=['GET', 'POST'])
def shopPwdPage():
    """
    商家密码修改界面
    :return:
    """
    spread_pwd=''
    if request.method == 'POST':
        spread_pwd = request.form.get('spread_pwd')

    return render_template('/spread/editPwdShop.html',spread_pwd=spread_pwd)



@bp.route('/spread/editPwdPerson', methods=['GET', 'POST'])
def editPwdPerson():
    """
    个人密码修改
    :return:
    """
    msg = ''
    if request.method == 'POST':
        # login= request.form.get('id')

        oldpassword = request.form.get('oldpassword')
        newpassword = request.form.get('newpassword')
        pwd_md5 = md5(newpassword)

        biz = spread()
        msg = biz.edit_PwdPerson(session['spread_id'], newpassword,pwd_md5)
    if msg:
        return "1"
    else:
        return "0"



@bp.route('/spread/editPwdShop', methods=['GET', 'POST'])
def editPwdShop():
    """
    商家密码修改
    :return:
    """
    msg = ''
    if request.method == 'POST':
        # login= request.form.get('id')
        oldpassword = request.form.get('oldpassword')
        newpassword = request.form.get('newpassword')
        pwd_md5 = md5(newpassword)
        print oldpassword
        print newpassword
        biz = spread()
        msg = biz.edit_PwdShop(session['spread_id'], newpassword,pwd_md5)
    if msg:
        return "1"
    else:
        return "0"



@bp.route('/spread/selectCardInfo', methods=['GET', 'POST'])
def selectCardInfo():
    """
    获得要修改的个人银行卡信息
    :return:
    """
    msg = ''
    if request.method == 'POST' or 'GET':
        # spread_id= request.form.get('id')

        biz = spread()
        msg = biz.select_BankCardPerson(session['spread_id'])
        # checkImg()
        print msg
    return render_template('/spread/editBankCardPerson.html', msg=msg)



@bp.route('/spread/selectShopCardInfo', methods=['GET', 'POST'])
def selectShopCardInfo():
    """
    获得要修改的商家银行卡信息
    :return:
    """
    msg = ''
    if request.method == 'POST' or 'GET':
        # spread_id= request.form.get('id')
        biz = spread()
        msg = biz.select_BankCardShop(session['spread_id'])
        # checkImg()
    return render_template('/spread/editBankCardShop.html', msg=msg)



@bp.route('/spread/selectShopInfo', methods=['GET', 'POST'])
def selectShopInfo():
    """
    获得要修改的商家店铺，地址信息
    :return:
    """
    msg = ''
    if request.method == 'POST' or 'GET':
        # spread_id= request.form.get('id')
        biz = spread()
        msg = biz.select_ShopInfo(session['spread_id'])
        print msg
    return render_template('/spread/editShopInfo.html', data=msg)



@bp.route('/spread/editBankCardPerson', methods=['GET', 'POST'])
def editBankCar():
    """
    个人银行卡修改
    :return:
    """
    msg = ''
    if request.method == 'POST':

        # login= request.form.get('id')

        bankAccount = request.form.get('bank_account')
        bankName = request.form.get('bank_name')

        biz = spread()
        msg = biz.edit_BankCardPerson(session['spread_id'], bankAccount, bankName)
        print msg
        if msg:
            return "1"
        else:
            return "0"
            # return render_template('/spread/editBankCardPerson.html', msg=msg)



@bp.route('/spread/editShopinfo', methods=['GET', 'POST'])
def editShopinfo():
    """
    商家的 店铺，地址修改
    :return:
    """
    msg = ''
    if request.method == 'POST':

        # login= request.form.get('id')
        spread_shop = request.form.get('spread_shop')
        spread_shopaddress = request.form.get('spread_shopaddress')

        biz = spread()
        msg = biz.edit_Shopinfo(session['spread_id'], spread_shop, spread_shopaddress)
        print msg
        if msg:
            return "1"
        else:
            return "0"
            # return render_template('/spread/editBankCardPerson.html', msg=msg)



@bp.route('/spread/editBankCardShop', methods=['GET', 'POST'])
def editBankCardShop():
    """
    商家银行卡修改
    :return:
    """
    msg = ''
    if request.method == 'POST':

        # login= request.form.get('id')
        bankAccount = request.form.get('bank_account')
        bankName = request.form.get('bank_name')

        biz = spread()
        msg = biz.edit_editBankCardShop(session['spread_id'], bankAccount, bankName)
        print msg
        if msg:
            return "1"
        else:
            return "0"



@bp.route('/spread/selectPerson', methods=['GET', 'POST'])
def selectPerson():
    """
    获取要编辑个人信息
    @:param
    @:return
    """
    # login= request.form.get('id')
    loginid = session['spread_id']

    biz = spread()

    data = biz.select_person(loginid)
    print data
    res = JSON.dumps(data)
    print res
    return res



@bp.route('/spread/spreadPage', methods=['GET', 'POST'])
def spreadPage():
    """
    地推主页面信息获取
    :return:
    """
    # if request.method == 'POST':

    # global spread_tel
    # spread_tel = request.values.get('spreadTel')
    # spread_tel = '13333333333'
    biz = spread()
    # spread_id = biz.select_spread_id(spread_tel)
    spread_id = biz.select_spread_id(session['spread_tel'])
    session['spread_id'] = spread_id

    print spread_id
    spread_kind = biz.select_spread_kind(spread_id)
    if spread_kind == '1':
        data = biz.select_all_msgs1(spread_id)
    elif spread_kind == '2':                                        # 地推人员
        data = biz.select_all_msgs2(spread_id)
    elif spread_kind == '3':                                        # 即饮商家
        data = biz.select_all_msgs3(spread_id)
    elif spread_kind == '4':                                        # 非即饮商家
        data = biz.select_all_msgs4(spread_id)
    # print data
    return render_template('/spread/spreadpage2.html', data=data, spread_kind=spread_kind)



@bp.route('/spread/clear', methods=['GET', 'POST'])
def clear():
    """
    商家本期信息清零,通过设置最新计数时间方式
    :return:
    """
    biz = spread()
    spread_id = session['spread_id']
    page_var = request.values.get("clear_condition")
    clear_condition = biz.clear_condition(spread_id)
    if clear_condition <= string.atof(page_var):
        msg = biz.clear(spread_id)
        return "OK"
    return "NO"

@bp.route('/spread/myPerformance', methods=['GET', 'POST'])
def myPerformance():
    """
    我的绩效
    :return:
    """
    if request.method == 'GET':
        biz = spread()
        spread_id = session['spread_id']
        spread_kind = biz.select_spread_kind(spread_id)

        if spread_kind == '1':                                  # 代言人
            data = biz.select_all_performance_1(spread_id)
            data2 = biz.select_persons_performance_1(spread_id)
        elif spread_kind == '2':                                # 地推人员
            data = biz.select_all_performance_2(spread_id)
            data2 = biz.select_persons_performance_2(spread_id)
        elif spread_kind == '3':                                # 即饮商家
            data = biz.select_all_performance_3(spread_id)
            data2 = biz.select_persons_performance_3(spread_id)
        elif spread_kind == '4':                                # 非即饮商家
            data = biz.select_all_performance_4(spread_id)
            data2 = biz.select_persons_performance_4(spread_id)

        data3 = data

        """以下为报表数据显示算法"""
        i = 0
        j = 0
        for rows in data:
            print data[i]['m_earned']
            if i == len(data) - 1:
                rows.setdefault('increase', '/static/weixin/Images/spread/increase.png')
            else:
                if data[i]['m_earned'] >= data[i + 1]['m_earned']:
                    rows.setdefault('increase', '/static/weixin/Images/spread/increase.png')
                    i += 1
                elif data[i]['m_earned'] < data[i + 1]['m_earned']:
                    rows.setdefault('increase', '/static/weixin/Images/spread/decrease.png')
                    i += 1

            for rows2 in data2:
                if j == len(data2) - 1:
                    rows.setdefault('increase_p', '/static/weixin/Images/spread/increase.png')
                else:
                    if data2[j]['persons_num'] >= data2[j + 1]['persons_num']:
                        rows.setdefault('increase_p', '/static/weixin/Images/spread/increase.png')
                        j += 1
                    elif data2[j]['persons_num'] < data2[j + 1]['persons_num']:
                        rows.setdefault('increase_p', '/static/weixin/Images/spread/decrease.png')
                        j += 1
                if rows['m_month'] == rows2['c_month'] and rows['m_year'] == rows2['c_year']:
                    rows.setdefault('persons_num', rows2['persons_num'])

        return render_template('/spread/my_performance.html', data=data3)



@bp.route('/spread/questions', methods=['GET', 'POST'])
def questions():
    """
    常见问题
    :return:
    """

    biz = spread()
    spread_id = session['spread_id']
    spread_kind = biz.select_spread_kind(spread_id)
    return render_template('/spread/questions.html', spread_kind=spread_kind)



@bp.route('/spread/register', methods=['GET', 'POST'])
def register():
    """
    个人注册
    :return:
    """
    # checkImg()
    return render_template('spread/register.html')

@bp.route('/spread/registerForShop', methods=['GET', 'POST'])
def registerForShop():
    """
    注册for商店
    :return:
    """
    return render_template('spread/registerForShop.html')

@bp.route('/spread/registerSuccess', methods=['GET', 'POST'])
def registerSuccess():
    """
    个人注册成功
    :return:
    """
    biz = spread()
    if request.method == 'POST':
        phoneNumber = request.form.get('phoneNumber')
        verificationCode = request.form.get('verificationCode')
        password = request.form.get('password')
        bankId = request.form.get('bankId')
        selectBank = request.form.get('selectBank')
        bankCardUsername = request.form.get('bankCardUsername')

        #md5加密
        pwd_md5 = md5(password)

        twoCode = session['twoCode']
        open_id = session['open_id']

        session.pop('twoCode')
        # 插入并返回新个人地推账号。
        msg = biz.insert_person(twoCode, phoneNumber, password, bankId, selectBank, bankCardUsername,pwd_md5,open_id)
    return render_template('spread/registerSuccess.html', msg=msg)

@bp.route('/spread/registerSuccessShop', methods=['GET', 'POST'])
def registerSuccessShop():
    """
    商铺注册成功
    :return:
    """
    phoneNumber = request.form.get('phoneNumber')
    verificationCode = request.form.get('verificationCode')
    password = request.form.get('password')
    bankId = request.form.get('bankId')
    selectBank = request.form.get('selectBank')
    bankCardUsername = request.form.get('bankCardUsername')
    shopName = request.form.get('shopName')
    shopAddress = request.form.get('shopAddress')
    shoptype = request.form.get('type')

    open_id = session['open_id']

    biz = spread()

    #md5加密
    pwd_md5 = md5(password)

    print phoneNumber, verificationCode, password, bankId, selectBank, bankCardUsername, shopAddress, shopName, shoptype

    twoCode = session['twoCode']

    msg = biz.insert_registerForShop(phoneNumber,password,bankId,selectBank,bankCardUsername,shopAddress,shopName,shoptype,twoCode,pwd_md5,open_id)
    return render_template('spread/registerSuccessShop.html',msg=msg)



@bp.route('/spread/registerAll', methods=['GET', 'POST'])
def registerAll():
    """
    二维码注册
    :return:
    """

    twoCode = request.form.get("twoCode")
    biz = spread()
    # 图形验证码
    # checkImgP = checkImg()
    # print checkImgP
    session['twoCode'] = ""
    if twoCode:
        msg = biz.select_twoCode(twoCode)
        if msg == '0':
            session['twoCode'] = twoCode
            checkTowCodeNum = twoCode[0:1]
            if checkTowCodeNum == 'P':
                return render_template('spread/register.html',twoCode=twoCode)
            elif checkTowCodeNum == 'B':
                return render_template('spread/registerForShop.html',twoCode=twoCode)
        else:
            checkNO = '1'
            return render_template('spread/registerAll.html',checkNO=checkNO)
    return render_template('spread/register.html', twoCode="")



@bp.route('/spread/registerAllFirst', methods=['GET', 'POST'])
def registerALLfirst():
    checkNO = '0'
    return render_template('spread/registerAll.html',checkNO=checkNO)



# 用于异步查询数据库里面是不是有这个二维码
@bp.route('/spread/checkTowCode', methods=['GET', 'POST'])
def checkTowCode():
    twoCode = request.values.get('twoCode')
    biz = spread()
    msg = biz.select_twoCode(twoCode)
    if msg == '1':
        num = '1'
        return num
    else:
        num = '0'
        return num



# 用于发送短信验证码，并返回验证码
@bp.route('/spread/checkNum', methods=['GET', 'POST'])
def checkNum():
    phoneNumber = request.values.get('phoneNumber')
    y = ''
    for i in range(0, 6):
        x = random.randint(0, 9)
        y = y + str(x)
    send_sms_check(y,phoneNumber)
    print y
    return y

# 验证账号密码
@bp.route('/spread/checkPwd',methods=['GET','POST'])
def checkPwd():
    biz = spread()

    if request.method == 'POST':
        spread_tel = request.form.get('spreadTel')
        session['spread_tel'] = spread_tel
        # spread_tel = '13333333333'
        spread_pwd = request.form.get('spreadPwd')
        pwd_md5 = md5(spread_pwd)
        msg = biz.sql_check(spread_tel,pwd_md5)
        return str(msg)



# 找回密码
@bp.route('/spread/callBackPwd',methods=['GET','POST'])
def callPwdBack():
    # checkImg()
    return render_template('spread/callBackPwd.html')



# 更新密码
@bp.route('/spread/newPwd',methods = ['GET','POST'])
def newPwd():
    biz = spread()
    if request.method == 'POST':
        spread_tel = request.form.get('phoneNumber')
        spread_newPwd = request.form.get('password')
        pwd_md5 = md5(spread_newPwd)
        msg = biz.newPwd(spread_tel,spread_newPwd,pwd_md5)
        return str(msg)

@bp.route('/spread/checkPhone',methods = ['GET','POST'])
def checkPhone():
    biz = spread()
    if request.method == 'POST':
        spread_tel = request.form.get('phoneNumber')
        msg = biz.select_spread_phoneNum(spread_tel)
        print msg
        return str(msg)

# 随机字母:
def rndChar():
    return chr(random.randint(65, 90))

# 随机颜色1:
def rndColor():
    return (random.randint(64, 255), random.randint(64, 255), random.randint(64, 255))

# 随机颜色2:
def rndColor2():
    return (random.randint(32, 127), random.randint(32, 127), random.randint(32, 127))


@bp.route('/spread/checkImg',methods=['GET','POST'])
def checkImg():
    # 240 x 60:
    width = 60 * 4
    height = 60
    checkImgP = ''
    image = Image.new('RGB', (width, height), (255, 255, 255))
    # 创建Font对象:
    font = ImageFont.truetype('Arial.ttf', 36)
    # 创建Draw对象:
    draw = ImageDraw.Draw(image)
    # 填充每个像素:
    for x in range(width):
        for y in range(height):
            draw.point((x, y), fill=rndColor())
    # 输出文字:
    for t in range(4):
        abc = rndChar()
        draw.text((60 * t + 10, 10), abc, font=font, fill=rndColor2())
        checkImgP = checkImgP + abc
    session['checkImgP'] = checkImgP
    print checkImgP
    print  session['checkImgP']
    # 模糊:
    image = image.filter(ImageFilter.BLUR)
    image.save('static/weixin/Images/spread/code.jpg', 'jpeg')
    return checkImgP

@bp.route('/spread/checkImgCode',methods=['GET','POST'])
def checkImgCode():
    checkImgP = session['checkImgP']
    if request.method == 'POST':
        checkImgCode = request.form.get('checkImgCode')
        print(checkImgCode)
        print checkImgP
        if checkImgP == checkImgCode:
            return '1'
        elif checkImgCode == "":
            return '2'
        elif checkImgP != checkImgCode:
            return '0'
# md5加密
def md5(str):
    m = hashlib.md5()
    m.update(str)
    return m.hexdigest()