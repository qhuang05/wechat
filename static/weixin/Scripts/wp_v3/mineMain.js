$(function () {
    $("#my_Level").click(function () {
        window.location.href = "/wechat/myLevel"
    });
    $("#my_voucher").click(function () {
        window.location.href = "/wechat/voucher?check_voucher=0"
    });
    $("#my_Integral").click(function () {
        window.location.href = "/wechat/integral"
    });
    $("#my_medal").click(function () {
        window.location.href = "/medal/index"
    });
    $("#my_collection").click(function () {
        window.location.href = "/mine/myCollections"
    });
    $("#my_signIn").click(function () {
        window.location.href = "/wechat/signIn"
    });
    $("#DZF").click(function () {
        window.location.href = "/wechat/index/all_orders?check_view=2"
    });
    $("#DSF").click(function () {
        window.location.href = "/wechat/index/all_orders?check_view=3"
    });
    $("#QBDD").click(function () {
        window.location.href = "/wechat/index/all_orders"
    })
});