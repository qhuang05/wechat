#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
from src import biz
# from qiniu import Auth, put_file

__author__ = 'McGee'

access_key='I7X6OpJTQfzTJCjsO8Yb8GoGSxmb-UKq_VMS-51t'
secret_key='4-0_chgPtPtVhdRse2G9Mo1a8Fk6R5iRD1-8d4JG'
bucket_name='paybeer'
#测试地址
# bucket_domain='7xq04v.com2.z0.glb.qiniucdn.com'
#正式地址
bucket_domain='pic.wp.beerwhere.cn'

class SaveCow(biz.Biz):

    def __init__(self):
        """
        @:return;
        """
        self.__access_key = access_key
        self.__secret_key = secret_key
        #使用access_key, secret_key登陆七牛，得到auth类型的返回值， 以它作为后续操作凭证。
        self.__auth = Auth(access_key, secret_key)



    def upload_files(self, pic_url, pic_contentType, filename):
        """
        图片素材上传
        @:param pic_url  图片地址
        @:param pic_contentType  文件类型
        @:param filename     文件名
        @:return
        """
        try:
            rets = []
            infos = []
            filedict = {}
            params = {'x:a': 'a'}
            filedict.setdefault(filename, pic_url)
            for key in filedict.keys():
                # 上传策略仅指定空间名和上传后的文件名，其他参数为默认是
                upload_token = self.__auth.upload_token(bucket_name, key)
                progress_handler = lambda progress, total:progress
                ret, info = put_file(upload_token, key, filedict[key], params, mime_type=pic_contentType, progress_handler=progress_handler)
                rets.append(ret)
                infos.append(info)
            private_url = self.download_files(filename)
            if private_url != 'pic_error':
                return private_url
        except Exception, e:
            print e
            return None



    def download_files(self, filename):
        """
        下载回传上传图片URL
        @:param     filename 文件名称
        @:param     bucket_domain 域名名称
        @:return
        """
        try:
            base_url='http://%s/%s'%(bucket_domain, filename)
            private_url = self.__auth.private_download_url(base_url, expires=3600)
            r = requests.get(private_url)
            assert r.status_code == 200
        except Exception, e:
            print e
            return 'pic_error'
        return private_url



