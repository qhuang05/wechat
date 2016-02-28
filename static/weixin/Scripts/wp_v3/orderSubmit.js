/**
 * Created by hqh on 16/1/6.
 */
$(document).ready(function () {
    ///测试数据:
    //sessionStorage.setItem('total', '178');
    //sessionStorage.setItem('count', '7');
    //sessionStorage.setItem('1', '4,6,啤酒111,9.0');
    //sessionStorage.setItem('2', '1,6,啤酒222,10.0');
    //sessionStorage.setItem('3', '7,6,啤酒333,11.0');
    //
    ////读取sessionStorage存放的订单商品信息显示到页面
    //var goodsIdArr = [];        //存放商品列表的id, sessionStorage的key值
    //var goodsList = [];          //存放商品列表的详细参数, sessionStorage的value值(array)
    //for (var i = 0; i < sessionStorage.length; i++) {
    //    var key = sessionStorage.key(i);
    //    var value = sessionStorage.getItem(key);
    //    if (value != null)
    //        value = value.split(",");
    //    if (!isNaN(parseInt(key))) {
    //        goodsIdArr.push(parseInt(key));         //goodsIdArr=[10,11,12]
    //        goodsList.push(value);                  //goodsList=[[1,6,啤酒1,9.0],[2,6,啤酒2,10.0],[12','3,6,啤酒3,11.0]]
    //    }
    //}
    ////获取商品图片地址
    //$.ajax({
    //    type: 'POST',
    //    url: '/mall/getGoodsImgs',
    //    data: {goodsid: goodsIdArr},
    //    success: function (result) {
    //        var _result = JSON.parse(result);
    //        //创建商品一览表
    //        for (var i = 0; i < goodsIdArr.length; i++) {
    //            var oImg = "<img src='" + _result[goodsIdArr[i]] + "' width='168px' height='69px' />";
    //            var oDiv1 = $('<div></div>').attr('class', 'am-u-sm-7').html(oImg);
    //            var oName = $("<h4></h4>").text(goodsList[i][2]).css({'font-size': '15px', 'list-style': 'none'});
    //            var oIcon = "<img src='../../../static/weixin/Images/wp_v3/icon_money.png' width='9px' height='12px' />";
    //            var oPrice = $('<span></span>').text(goodsList[i][3]).css({
    //                'font-size': '13px',
    //                'vertical-align': 'middle'
    //            });
    //            var oSpan1 = $('<span></span>').text("元/").css({'font-size': '13px', 'vertical-align': 'middle'});
    //            var oSpan2 = $('<span></span>').text("瓶").css({'font-size': '13px', 'vertical-align': 'middle'});
    //            var oNum = $('<input />').attr({'type': 'text', 'value': goodsList[i][0]}).css('display', 'none');
    //            var oDiv2 = $('<div></div').attr('class', 'am-u-sm-5').append(oName, oIcon, oPrice, oSpan1, oSpan2, oNum);
    //            var oLi = $('<li></li>').attr('class', 'am-g').css({
    //                'border': '0',
    //                'margin-bottom': '6px'
    //            }).append(oDiv1, oDiv2);
    //            $('#goodsList').append(oLi);
    //        }
    //    }
    //});

    //收货人存入sessionStorage: consigneeName, consigneeTel(string类型)
    if (sessionStorage.getItem('consigneeName') && sessionStorage.getItem('consigneeTel')) {
        var name = sessionStorage.getItem('consigneeName');
        var tel = sessionStorage.getItem('consigneeTel');
        var id = sessionStorage.getItem('consigneeId');
        $('#consignee').val(name + '  ' + tel);
        $('#consigneeName').val(name);
        $('#consigneeTel').val(tel);
        $('#consigneeId').val(id);
    }
    else {
        var name = document.getElementById('consignee').value.split('  ')[0];
        var tel = document.getElementById('consignee').value.split('  ')[1];
        var id= document.getElementById('consigneeId').value;
        sessionStorage.setItem('consigneeName', name);
        sessionStorage.setItem('consigneeTel', tel);
        sessionStorage.setItem('consigneeId', id);
    }

    //送达时间存入sessionStorage: reachedTime
    var reachedTime = sessionStorage.getItem('reachedTime')
    if(reachedTime != null || reachedTime != undefined || reachedTime != '') {
        var curIndex = sessionStorage.getItem('reachedTime');
        $('#reachedTime option').attr('selected',false);
        $('#reachedTime option').eq(parseInt(curIndex)).attr('selected',true);
    }
    else {
        var curIndex = $('#reachedTime').find('option:selected').index();   //标识当前选中项
        sessionStorage.setItem('reachedTime', curIndex);
    }
    $('#reachedTime').change(function(){
        var curIndex = $(this).find('option:selected').index();
        sessionStorage.setItem('reachedTime', curIndex);
    });

    //备注信息存入sessionStorage: notes
    if (sessionStorage.getItem('notes')) {
        var notes = sessionStorage.getItem('notes');
        $('#notes').val(notes);
        $('#notes').change(function () {
            var notes = $('#notes').val();
            sessionStorage.setItem('notes', notes);
        });
    }
    else {
        var notes = $('#notes').val();
        sessionStorage.setItem('notes', notes);
        $('#notes').change(function () {
            var notes = $('#notes').val();
            sessionStorage.setItem('notes', notes);
        });
    }

    //使用优惠券
    $('#useCoupon').click(function () {
        window.location.href = '/wechat/voucher?check_voucher=1';
    });
    var isVoucherUsed = $('#coupon #sFlag').val();
    var totalPrice = parseFloat($('#totalPrice').val());
    if(sessionStorage.getItem('voucher_id')) {
        var voucher_id = sessionStorage.getItem('voucher_id');
        $.ajax({
            type: 'POST',
            url: '/mall/getVoucherMoney',
            data: {voucher_id: voucher_id},
            success: function(data){
                $('#useCoupon').empty();
                var oSpan = "<span>"+data+"优惠券</span>"
                var oInput = "<input type='hidden' id='voucher' name='voucher' value='"+voucher_id+"' />"
                $('#useCoupon').append(oSpan,oInput);
                isVoucherUsed = '1';
                $('#useCoupon').addClass('useVoucher');
                var voucherMoney = parseFloat(data);
                var _totalPrice = (totalPrice-voucherMoney).toFixed(2);
                $('#totalPrice').val(_totalPrice);
            }
        });
    }
    else {
        $('#useCoupon').removeClass('useVoucher');
    }

    //收货地址存入sessionStorage: consigneeAddr(json类型)--{address:***, lng:***, lat:***}
    if (sessionStorage.getItem('consigneeAddr')) {
        var addr = sessionStorage.getItem('consigneeAddr');
        var _addr = JSON.parse(addr);
        $('#consigneeAddr').val(_addr['address']);
        $('#consigneeAddr_lng').val(_addr['lng']);
        $('#consigneeAddr_lat').val(_addr['lat']);
    }
    else {
        //var addressText = $('#consigneeAddr').val();
        //var addressLng = $('#consigneeAddrLng').val();
        //var addressLat = $('#consigneeAddrLat').val();
        //var addr = {address: addressText, lng: addressLng, lat: addressLat};
        //var _addr = JSON.stringify(addr);
        //sessionStorage.setItem('consigneeAddr', _addr);

        showCurrentPosition();
        var addr = sessionStorage.getItem('consigneeAddr');
        var _addr = JSON.parse(addr);
        $('#consigneeAddr').val(_addr['address']);
        $('#consigneeAddrLng').val(_addr['lng']);
        $('#consigneeAddrLat').val(_addr['lat']);
    }

    //支付方式标识, "1"为微信支付, "2"为货到付款
    $('#payMethod .wexin').click(function(){
        $('#urlid').val('1');
    });
    $('#payMethod .cash').click(function(){
        $('#urlid').val('2');
    });
});

//选择收货人
function selectConsignee() {
    window.location.href = '/mine/selectConsignee';
}

//选择收货地址
function addrManage() {
    window.location.href = '/mine/addrManage';
}


/**
 * 微信支付
 */
function wx_pay() {
    var check_time1 = check_time();
    var othertel = $("#other_tel").val();
    var othername = $("#other_name").val();
    var adderss = $("#keyword").val();
    var remark = $("#remark").val();
    var orderid = $("#orderId").val();

    if (othertel == "" || othertel == undefined || othertel == null) {
        alert("请输入电话号码！");
        return;
    }
    if (othername == "" || othername == undefined || othername == null) {
        alert("请输入联系人！");
        return;
    }
    if (adderss == "" || adderss == undefined || adderss == null) {
        alert("定位地址！");
        return;
    }
    if (!check_time1)
        return;
    var ordersubmit = $("#orderInfo").serialize();

    $.ajax({
        type: 'POST',
        url: '/mall/wxcash',
        data: ordersubmit,
        success: function (charge) {
            pingpp.createPayment(charge, function (result, error) {
                if (result == "success") {
                    // 微信公众账号支付的结果会在这里返回
                    //超链接转至订单跟踪页面
                    window.location.href = 'http://wp.beerwhere.cn/wechat/shopping/orderDetails?orderid=' + orderid;
                    //window.location.href = 'http://127.0.0.1:5000/wechat/shopping/orderDetails?orderid=' + orderid;
                } else if (result == "fail") {
                    // charge 不正确或者微信公众账号支付失败时会在此处返回
                } else if (result == "cancel") {
                    // 微信公众账号支付取消支付
                    $.post('/wechat/shopping/wxcashcancel');
                } else {
                    window.location.href = 'http://wp.beerwhere.cn/wechat/shopping/orderDetails?orderid=' + orderid;
                }
            });
        }
    });

    //submited();
    //预约送达时间必须提前半小时
    function check_time() {
        var time = new Date();
        var current_hour = time.getHours();
        var current_minutes = time.getMinutes();
        var selected = $("#selectid").find("option:selected").text();
        var selected_val = $("#selectid").val();
        var selected_hours = parseInt(selected.substr(0, 2));
        var selected_minutes = parseInt(selected.substr(3, 2));
        //alert(parseInt(selected_val))
        if (parseInt(selected_val) > 0) {
            if (selected_hours < current_hour) {
                alert("预约送达时间必须提前半小时");
                return false;
            }
            else if (selected_hours == current_hour && selected_minutes < current_minutes) {
                alert("预约送达时间必须提前半小时");
                return false;
            }
            else
                return true;
        }
        else
            return true;
    }

}

//微信货到付款
function wx_deliverypay() {
    var checkConsignee = checkConsignee();
    var checkConsigneeAddr = checkConsigneeAddr();
    var checkTime = checkReachedTime();
    if (checkConsignee == false || checkConsigneeAddr == false || checkTime == false) {
        return;
    }
    else {
        var orderForm = document.getElementById('orderForm');
        orderForm.submit();
        clear_sessions();
    }

    //判断收货人是否为空
    function checkConsignee() {
        var consignee = $('#consignee').val();
        if (consignee == "" || consignee == undefined || consignee == null) {
            alert('收货人不能为空');
            return false;
        }
        else {
            return true;
        }
    }

    //判断收货地址是否为空
    function checkConsigneeAddr() {
        var consigneeAddr = $('#consigneeAddr').val();
        if (consigneeAddr == "" || consigneeAddr == undefined || consigneeAddr == null) {
            alert('收货地址不能为空');
            return false;
        }
        else {
            return true;
        }
    }

    //判断送达时间是否提前半小时
    function checkReachedTime() {
        var oDate = new Date();
        var curHour = oDate.getHours();
        var curMinute = oDate.getMinutes();
        var selectedHour = parseInt($('#reachedTime').find('option:selected').text().substr(0, 2));
        var selectedMinute = parseInt($('#reachedTime').find('option:selected').text().substr(3, 2));
        if (curHour > selectedHour || (curHour == selectedHour && curMinute > selectedMinute)) {
            alert("预约送达时间必须提前半小时");
            return false;
        }
        else {
            return true;
        }
    }

    //购买完成清除页面session
    function clear_sessions() {
        if (sessionStorage.length > 0) {
            sessionStorage.clear();
        }
    }
}