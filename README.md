
/* 
	玩啤微信V3.0平台及管理端开发开发日志


	date:20160105
	name:SHALEI
	remark：该日志主要记录开发过程中所需的库、开发包、依赖包名称与相关安装方法。根据开发需要进行长期维护。

	开发库通过终端执行安装，相关开发包通过IDE执行安装。部分依赖包需要手动执行安装。
 */


一、开发库
		pip
		yum


二、开发包信息
		Flask
		Flask-Cache
		Flask-Celery
		Flask-Celery3
		Flask-Login
		Flask-SQLAlchemy
		Flask-Script
		Flask-Weixin
		Jinja2
		MySQL-python
		Pillow
		pillow-PIL
		PyMySQL
		SQLAlchemy
		Werkzeug
		apns
		celery
		crypto
		gevent
		pingpp
		pycrypto
		xlwt
		qiniu
		redis


三、依赖包安装方法
	1、手动安装pillow
		yum install zlib-devel
		yum install libjpeg libjpeg-level
		yum install freetype freetype-devel
		yum install python-devel
		yum install python-imaging
		yum install libpng libpng-devel
		yum -y insetall gd 
		上面安装完成后，最后必须再重新安装pillow(如果上面有安装pillow,先卸载再重装)

	2、自动安装redis
		sudo pip install redis

	3、自动安装qiniu
	    pip install qiniu
		或者
		easy_install qiniu


四、工程结构
	1、/templates 		前台模版
			/spread	   		地推模版
			/webcontent		后台管理端模版
			/wechat			wechat模版

	2、/src				后台代码
			/api
			/biz
			/manager		接口
			/spread			地推后台
			/tasks			定时器
			/tools			工具类
			/web			后台管理
			/wechat			wechat端
	