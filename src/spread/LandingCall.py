#coding=gbk

#coding=utf-8

#-*- coding: UTF-8 -*-  

from CCPRestSDK import REST
import ConfigParser

#���ʺ�
accountSid= '8a48b5514ef922c2014efca1a0cc03b8';

#���ʺ�Token
accountToken= 'd9a4a322f3e2462a8a2de1f4943ba0c3';

#Ӧ��Id
appId='aaf98f894ef91b17014efcbc5a7a0492';

#�����ַ����ʽ���£�����Ҫдhttp://
serverIP='app.cloopen.com';

#����˿� 
serverPort='8883';

#REST�汾��
softVersion='2013-12-26';

    # ���֪ͨ
    # @param to ��ѡ����    ���к���
    # @param mediaName ��ѡ����    �����ļ����ƣ���ʽ wav����mediaTxt����ͬʱΪ�ա�����Ϊ��ʱmediaTxt����ʧЧ��
    # @param mediaTxt ��ѡ����    �ı�����
    # @param displayNum ��ѡ����    ��ʾ�����к���
    # @param playTimes ��ѡ����    ѭ�����Ŵ�����1��3�Σ�Ĭ�ϲ���1�Ρ�
    # @param respUrl ��ѡ����    ���֪ͨ״̬֪ͨ�ص���ַ����ͨѶƽ̨�����Url��ַ���ͺ��н��֪ͨ��
    # @param userData ��ѡ����    �û�˽������
    # @param maxCallTime ��ѡ����    ���ͨ��ʱ��
    # @param speed ��ѡ����    �����ٶ�
    # @param volume ��ѡ����    ����
    # @param pitch ��ѡ����    ����
    # @param bgsound ��ѡ����    ���������

def landingCall(to,mediaName,mediaTxt,displayNum,playTimes,respUrl,userData,maxCallTime,speed,volume,pitch,bgsound):

    
    #��ʼ��REST SDK
    rest = REST(serverIP,serverPort,softVersion)
    rest.setAccount(accountSid,accountToken)
    rest.setAppId(appId)
    
    result = rest.landingCall(to,mediaName,mediaTxt,displayNum,playTimes,respUrl,userData,maxCallTime,speed,volume,pitch,bgsound)
    for k,v in result.iteritems(): 
        
        if k=='LandingCall' :
                for k,s in v.iteritems(): 
                    print '%s:%s' % (k, s)
        else:
            print '%s:%s' % (k, v)
   
   
#landingCall('���к���','�����ļ�����','�ı�����','��ʾ�����к���','ѭ�����Ŵ���','���֪ͨ״̬֪ͨ�ص���ַ','�û�˽������','���ͨ��ʱ��','�����ٶ�','����','����','���������')

# to = '15750798687'
# mediaName = "myMic.wav"
# mediaTxt = ""
# respUrl = ""
# userData = ""
# maxCallTime = ""
# speed = ""
# volume = ""
# pitch = ""
# bgsound = ""
# displayNum = ""
# playTimes = 3
# landingCall(to,mediaName,mediaTxt,displayNum,playTimes,respUrl,userData,maxCallTime,speed,volume,pitch,bgsound)