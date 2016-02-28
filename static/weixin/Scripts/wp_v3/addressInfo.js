/**
 * Created by hqh on 16/1/4.
 */

$(function(){

    document.getElementById("searchText").addEventListener("input", showSearchAddr, false);

    //点击搜索地址栏样式变化
    $('#search').click(function(){
        $(this).css({'float':'left','width':'80%'});
        $(this).find('img').css('display','none');
        $(this).find('input').css('width','100%');
        $('#cancelBtn').css('display','block');
    });

    //点击取消按钮后回到初始样式
    $('#cancelBtn').click(function(){
        $('#searchList').hide();
        $('#location').show();
        $('#searchHistory').show();
        $(this).css('display','none');
        $('#search').css({'float':'none','width':'auto'});
        $('#search').find('img').css('display','inline-block');
        $('#search').find('input').css('width','8rem');
        $('#search').find('input').val('');
        $('#search').find('input').attr('placeholder','搜索地址');

    });

    //选择历史记录中的某条记录
    $('#historyList li').click(function(){
        selectedAddr(this);
    });

    //定位用户当前的地理位置
    $('#location').click(function(){
        alert('进入微信定位...');
        showCurrentPosition();
    });
});

//显示输入搜索地址后模糊匹配出的地址列表
function showSearchAddr() {
    var addrText = $('#searchText').val();
    if (addrText != '') {
        $('#location').hide();
        $('#searchHistory').hide();
        $.ajax({
            type: 'GET',
            url: '/mine/addrSearchList',
            data: {address: addrText},
            success: function (result) {
                $('#searchList').empty();
                var addrSearchResult = JSON.parse(result);
                var addrNum = addrSearchResult['count'];
                var addrData = addrSearchResult['data'];    //list类型,list中是json类型的数据
                var oUL = $('<ul></ul>').attr('id', 'addrItems').css({'list-style': 'none', 'margin':'2rem 0', 'padding':'0'});
                for (var i = 0; i < addrNum; i++) {
                    var oAddr = "<span>" + addrData[i]['address'] + "</span>";
                    var oLng = "<span style='display:none'>" + addrData[i]['location']['lng'] + "</span>";
                    var oLat = "<span style='display:none'>" + addrData[i]['location']['lat'] + "</span>";
                    var oLi = $('<li></li>').html(oAddr + oLng + oLat).attr({
                        'id': addrData[i]['id'],
                        'onclick': 'selectedAddr(this)'
                    }).css('padding', '0.5rem');
                    oUL.append(oLi);
                }
                $('#searchList').append(oUL);
            }
        });
    }
    else {
        $('#searchList').empty();
        $('#location').show();
        $('#searchHistory').show();
    }
}

//选中搜索地址列表或历史记录中的其中一个返回到提交订单页面
function selectedAddr(target) {
    var addrText = $(target).find('span').eq(0).text();
    var addrLng = $(target).find('span').eq(1).text();
    var addrLat = $(target).find('span').eq(2).text();
    var addr = {address:addrText, lng:addrLng, lat:addrLat};     //把用户选中的地址存入sessionStorage, addr是一个json类型的值
    var _addr = JSON.stringify(addr);
    sessionStorage.setItem('consigneeAddr', _addr);
    //alert(sessionStorage.getItem('consigneeAddr'));
    window.location.href = '/mall/orderSubmit';
}

//根据wx提供的api接口,显示用户当前的位置信息
function showCurrentPosition() {
    wx.ready(function(){
        //根据wx提供的api接口,获取用户当前地理位置接口(经度,纬度)
        wx.getLocation({
            type: 'gcj02',  // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
            success: function (res) {
                var latitude = JSON.parse(res.latitude); // 纬度，浮点数，范围为90 ~ -90
                var longitude = JSON.parse(res.longitude); // 经度，浮点数，范围为180 ~ -180。
                //var speed = res.speed; // 速度，以米/每秒计
                var accuracy = JSON.parse(res.accuracy); // 位置精度
                $.ajax({
                    //根据经度,纬度信息获取用户的位置(文字信息)
                    type: 'POST',
                    url:'/weixin/gettxaddr',
                    data: {latitude: latitude, longitude: longitude},
                    success: function(result) {
                        if(result!='' && result!=undefined && result!=null) {
                            var addr = {address: result, lng: longitude, lat: latitude};
                            var _addr = JSON.stringify(addr);
                            sessionStorage.setItem('consigneeAddr', _addr);
                            //alert(sessionStorage.getItem('consigneeAddr'));
                            window.location.href = '/mall/orderSubmit';
                        }
                        else {
                            alert('地理位置获取失败！');
                            return;
                        }
                    }
                });
            },
            cancel: function(res){
                alert('用户拒绝授权获取地理位置');
            }
        });
    });
}
