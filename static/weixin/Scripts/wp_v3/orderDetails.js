/**
 * Created by hqh on 16/1/4.
 */

$(document).ready(function(){
    document.title = '订单详情';
    $('.orderNav a').click(function () {
        $('.orderNav li').removeClass('active');
        $(this).parent().addClass('active');

        //修改title
        var $body = $('body');
        var titleText = $(this).text();
        document.title = titleText;
        // hack在微信等webview中无法修改document.title的情况
        var $iframe = $('<iframe src="/favicon.ico"></iframe>');
        $iframe.on('load', function () {
            setTimeout(function () {
                $iframe.off('load').remove();
            }, 0);
        }).appendTo($body);
    });

    //订单详情: 订单状态
    var sendStatus = $('#sendStatus').text();
    if(sendStatus=='01') {
        $('#sendStatus').text('正在出库');
    }
    else if(sendStatus=='02') {
        $('#sendStatus').text('配送中');
    }
    else if(sendStatus=='03') {
        $('#sendStatus').text('已签收');
    }
    else {
        $('#sendStatus').text('已提交');
    }

    //订单详情: 支付方式
    var defrayType = $('#defrayType').text();
    if(defrayType=='01') {
        $('#defrayType').text('微信支付');
    }
    else if(defrayType=='02') {
        $('#defrayType').text('货到付款');
    }
    else {
        $('#defrayType').text('未知');
    }

    //订单状态
    var statusFlag = $('#statusFlag').val();
    if(statusFlag=='01') {
        $('#orderStatus li.status_02').attr('style', 'background-position:0 -360px');
        $('#orderStatus li.status_02 div').eq(1).css({'background':'#D9A633', 'color':'#FFFFFF'});
    }
    else if(statusFlag=='02') {
        $('#orderStatus li.status_03').attr('style', 'background-position:0 -360px');
        $('#orderStatus li.status_03 div').eq(1).css({'background':'#D9A633', 'color':'#FFFFFF'});

    }
    else if(statusFlag=='03'){
        $('#orderStatus li.status_04').attr('style', 'background-position:0 -345px');
        $('#orderStatus li.status_04 div').eq(1).css({'background':'#D9A633', 'color':'#FFFFFF'});

    }
    else {
        $('#orderStatus li.status_01').attr('style', 'background-position:0 -360px');
        $('#orderStatus li.status_01 div').eq(1).css({'background':'#D9A633', 'color':'#FFFFFF'});

    }

    //订单状态时间格式
    var today = new Date();
    var curYear = today.getFullYear();
    var curMonth = today.getMonth()+1;
    if(curMonth<10) {
        curMonth = '0' + curMonth;
    }
    var curDate = today.getDate();
    for(var i=0; i<4; i++) {
        var time = $('#orderStatus li .time').eq(i).text();
        var pageYear = time.substr(0,4);
        var pageMonth = time.substr(5,2);
        var pageDate = time.substr(8,2);
        var hourMin = time.substr(11,5);
        if(pageYear==curYear && pageMonth==curMonth && pageDate==curDate) {
            $('#orderStatus li .time').eq(i).text('今天'+hourMin);
        }
        else {
            $('#orderStatus li .time').eq(i).text(time.substr(0,16));
        }
    }

});

