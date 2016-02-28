/**
 * Created by Russell on 15/12/28.
 */

$(function () {

    //draw_canvas();
    main();
    tab_click();
    touch_events();
    search_goods();
    $("img.lazy").lazyload({
        /**
         * 图片懒加载,以及特效fadeIn
         */
        effect: "fadeIn"
    });
    window.onload = function () {
        //$("#loading_canvas").hide();
    }
});
function main() {
    var cart_click = $(".cart-sup");
    /*点击可出现购物车的元素*/
    var cart_money = $(".money-click");
    /*底部显示总价的元素*/
    var cart = $(".cart");
    /*购物车div*/

    /**
     * 刷新页面保留现场
     * @type {Storage}
     */
    var storage = window.sessionStorage;
    for (var i = 0, len = storage.length; i < len; i++) {
        var key = storage.key(i);
        var value = storage.getItem(key);
        if (value != null)
            value = value.split(",");
        /*alert(value_item[0]);*/
        /*if (value[0] == 0)*/
        /*    storage.removeItem(key);*/
        if (value[0] != 0) {
            $(".beer-item").find('#' + key).val(value[0]);
            cart.css({"display": "inherit", "animation": "pop-cart 1s", "-webkit-animation": "pop-cart 1s"});
            /*弹出购物车*/
            if (!isNaN(parseInt(key))) {
                alt_cart_item(key, value[0], value[2], value[3]);
                alt_form_item(key, value[0]);
            }
            else {
                $("#total").attr("value", storage.getItem("total"));
                /*input表单数据*/
                cart_click.text(storage.getItem("count"));
                cart_money.text(storage.getItem("total"));
            }
        }
    }

    $("#main").on("tap", function (e) {
        /**
         * 对body绑定tap事件
         */
        var clicked_class = event.target.className;
        /*var p = $(this).parent(); /*此处this指向绑定了事件的对象*/
        var p = $(event.target).parent();
        /*event.target(指向当前点击对象)和this都是dom对象,可以直接用*/
        var t = p.find('input[type=text]');
        var goods_id = t.attr('name') || p.find('span[class=disabled-input]').attr('name');
        /*alert(t.attr('id'));*/
        var tolerant_count = parseInt($(".beer-item").find('#h_' + goods_id).val() || $('#h_' + goods_id).val());
        /*选种商品的默认瓶数*/
        var ps = $(event.target).parents(".beer-item");
        var cart_ps_val = $(event.target).parents(".cart-list").find('.kinds>span').text().split("￥");
        /*购物车数据*/
        var p_name = ps.find('.img-bottom>span').text() || cart_ps_val[0];
        var p_price = ps.find('.unit-price').text() || cart_ps_val[1];
        switch (clicked_class) {
            case "bottle-inc":
                /**
                 * 增加按钮事件
                 * @type {*|jQuery}
                 */
                var num = parseInt(t.val() || p.find('span[class=disabled-input]').text());
                if (num == 0)
                    num += tolerant_count;
                else
                    num++;
                $("input[name=" + goods_id + "]").val(num);
                /*所有对应的输入框瓶数增加*/
                $("span[name=" + goods_id + "]").text(num);
                /*所有对应的输入框瓶数增加*/
                /*cart_click.text(parseInt(cart_click.text()) + 1);
                 购物车右上角数字增加*/
                cart.css({"display": "inherit", "animation": "pop-cart 1s", "-webkit-animation": "pop-cart 1s"});
                /*弹出购物车*/
                if (parseInt(t.val()) <= tolerant_count) {
                    t.val(tolerant_count);
                }
                var list_item = [num, tolerant_count, p_name, p_price];
                storage.setItem(goods_id, list_item);
                /*向session中添加商品map*/
                alt_cart_item(goods_id, num, p_name, p_price);
                setTotal();
                /*当前商品瓶数,默认瓶数,商品名,单价*/
                break;
            case "bottle-dec":
                /**
                 * 减少按钮
                 * @type {*|jQuery}
                 */
                var num = parseInt(t.val() || p.find('span[class=disabled-input]').text());
                if (num > tolerant_count) {  /*商品数不能小于最小瓶数*/
                    num--;
                    $("input[id=" + goods_id + "]").val(num);
                    /*所有对应的输入框瓶数增加*/
                    $("span[name=" + goods_id + "]").text(num);
                    /*所有对应的输入框瓶数增加*/
                    /*cart_click.text(parseInt(cart_click.text()) - 1);*/
                    alt_cart_item(goods_id, num, p_name, p_price);
                } else {
                    num = 0;
                    $("input[name=" + goods_id + "]").val(0);
                    /*所有对应的输入框瓶数增加*/
                    $("span[name=" + goods_id + "]").text(0);
                    /*所有对应的输入框瓶数增加*/
                    t.val(0);
                    $("#c_" + goods_id).remove();
                    if ($(".cart-list").length == 0) { /*判断购物车弹窗里的商品条目数0*/
                        $("#pop-cart").hide();
                        /*隐藏购物车弹窗*/
                        $(".cart").hide();
                        /*隐藏底部*/
                    }
                }
                /*cart.css("display", "none");   /*弹出购物车*/
                var list_item = [num, tolerant_count, p_name, p_price];
                /*当前商品瓶数,默认瓶数,商品名,单价*/
                storage.setItem(goods_id, list_item);
                setTotal();
                break;
            case "lazy":
                /**
                 * 点击商品列表图片跳转详情页
                 */
                var beer_id = (ps.attr("id") || p.attr("id")).split("_")[1];
                window.location.href = "/mall/goodDetails?id=" + beer_id;
            case "collect":
                /**
                 * 收藏按钮
                 */
                var article_child = ps.find(".disabled-input").attr("id");
                /*商品id*/
                var img_src = $(event.target);
                if (img_src.attr("src") == "/static/weixin/Images/wp_v3/btn_shoucang.png") {
                    /*执行收藏ajax*/
                    $.ajax({
                        type: "POST",
                        url: "/mine/addCollect",
                        data: {id: article_child}
                    }).done(function (msg) {    /*请求成功的回调*/
                        if (msg == '1') {
                            img_src.attr("src", "/static/weixin/Images/wp_v3/btn_pre_collection.png");
                        }
                        console.log("Data Saved: " + msg);
                    }).fail(function (msg) {    /*请求失败的回调*/
                        console.log("Data Saved: " + msg["readyState"]);
                    });
                } else {
                    /*执行取消收藏*/
                    $.ajax({
                        type: "POST",
                        url: "/mall/index",
                        data: {id: article_child}
                    }).done(function (msg) {    /*请求成功的回调*/
                        if (msg == '1') {
                            img_src.attr("src", "/static/weixin/Images/wp_v3/btn_shoucang.png");
                        }
                        console.log("Data Saved done: " + msg);
                    }).fail(function (msg) {    /*请求失败的回调*/
                        console.log("Data Saved: " + msg);
                    });
                }
                break;
            case "cart-click":
            case "bottom-click":
            case "cart-img":
            case "cart-sup":
            case "money-click":
                /**
                 * 弹出/隐藏购物车
                 */
                $("#pop-cart").toggle("slow");
                break;
            case "clear-button":
                /**
                 * 点击清空同时删除已经在sessionStorage的数据
                 */
                $(".disabled-input").val(0);
                $("span[class=disabled-input]").text(0);
                setTotal();
                $("#pop-cart").hide();
                /*隐藏购物车弹窗*/
                $(".cart").hide();
                /*隐藏底部*/
                $(".cart-list").remove();
                storage.clear();
                break;
            case "submit_button":
                $(".disabled-input").removeAttr("disabled");
                check_add();
                wx_pay();
                break;
            default:
                break;
        }

    });
    function setTotal() {
        /**
         * 计算总价
         * @type {number}
         */
        var s = 0;
        for (var i = 0, len = storage.length; i < len; i++) {
            var key = storage.key(i);
            var value = storage.getItem(key);
            if (!isNaN(parseInt(key))) {
                if (value != null) {
                    value = value.split(",");
                    s += parseInt(value[0]) * parseFloat(value[3]);
                }
            }
        }
        //$(".beer-list>div").each(function () {
        //    s += parseInt($(this).find('input[type=text]').val()) * parseFloat($(this).find('span[class*=unit-price]').text());
        //})
        cart_money.text(s.toFixed(1));
        $("#total").attr("value", s.toFixed(1));
        storage.setItem('total', s);
        setCount();
        return s;
    }

    function setCount() {
        /**
         * 计算总瓶数
         * @type {number}
         */
        var s = 0;
        for (var i = 0, len = storage.length; i < len; i++) {
            var key = storage.key(i);
            var value = storage.getItem(key);
            if (!isNaN(parseInt(key))) {
                if (value != null) {
                    value = value.split(",");
                    s += parseInt(value[0]);
                }
            }
        }
        //$(".beer-list>div").each(function () {
        //    s += parseInt($(this).find('input[type=text]').val());
        //})
        cart_click.text(s);
        /*var total = cart_money.text();*/
        storage.setItem('count', s);
        return s;
    }

    function alt_cart_item(goods_id, num, p_name, p_price) {
        /**
         * 点击加号向购物车添加item
         * @type {*|jQuery}
         */
        if ($("#list-container").find("#c_" + goods_id).length == 0) {
            var item = '<div id="c_' + goods_id + '" class="cart-list">' +
                '<div class="kinds"><span>' + p_name + '</span><span>￥' + p_price + '</span></div>' +
                '<div class="cart-input"><span class="bottle-dec">一</span>' +
                '<span class="disabled-input" id="c_' + goods_id + '" name="' + goods_id + '" >' + num + '</span>' +
                '<span class="bottle-inc">+</span></div></div>';
            $("#list-container").append(item);
        } else {
            var foc_item = $("#list-container").find("#c_" + goods_id).find("input");
            foc_item.val(num);
        }
    }

    function alt_form_item(good_id, num) {
        /**
         * 点击加号向form添加item
         * @type {*|jQuery}
         */
        if ($("#myform").find("#" + good_id).length == 0) {
            var item = '<input type="hidden" id="' + good_id + '" name="' + good_id + '" value="' + num + '">';
            $("#myform").append(item);
        } else {

        }
    }
}

function tab_click() {
    /**
     * 两个标签点击切换
     */
    /*$("div[title=1]").hide();*/
    var click_times = 0;
    /*记录点击次数*/
    $("div[title=2]").hide();
    $("#import").on("tap", function () {    /*进口酒显示*/
        if (click_times != 0) {
            $("#handwork").css("color", "#323232");
            event.target.style.color = "#D9A633";
            $("#move-hr").css({
                "animation": "move-hr-l 1s",
                "-webkit-animation": "move-hr-l 1s",
                "animation-fill-mode": "forwards",
                "-webkit-animation-fill-mode": "forwards"
            });
            $("div[title=2]").hide();
            $("div[title=1]").show();
        }
    });
    $("#handwork").on("tap", function () {  /*手工精酿显示*/
        $("#import").css("color", "#323232");
        event.target.style.color = "#D9A633";
        $("#move-hr").css({
            "animation": "move-hr-r 1s",
            "-webkit-animation": "move-hr-r 1s",
            "animation-fill-mode": "forwards",
            "-webkit-animation-fill-mode": "forwards"
        });
        $("div[title=2]").show();
        $("div[title=1]").hide();
    })
    click_times++;
}


function check_add() {
    /**
     * 验证有无添加商品
     */
    var total = $("#total").val();
    var type4_bottle = sessionStorage.getItem('count');
    if (parseInt(type4_bottle) >= 6) {
        if (total != "0.0") {
            $("#myform").submit();
        } else {
            alert("您还没选择足够的商品哦");
            return false;
        }
    }
    else if (parseInt(type4_bottle) == 0) {
        if (total != "0.0") {
            $("#myform").submit();
        } else {
            alert("您还没选择足够的商品哦");
            return false;
        }
    }
    else {
        alert("手工精酿怎么也得不少于6瓶嘛");
        return false;
    }
}

function touch_events() {
    /**
     * 让触摸表现出滑动效果
     * @type {number}
     */
    var page_y = 0;
    var page_st_y = 0;
    var page_end_y = 0;
    document.getElementById("main").addEventListener("touchstart", function (ev) {
        /*alert(ev.touches.length);*/
        page_st_y = ev.touches[0].clientY;
        event.preventDefault();
        /*解决微信中touchstart以外事件无效的问题*/
    }, false);
    document.getElementById("main").addEventListener("touchmove", function (ev) {
        var scroll_top = document.body.scrollTop || document.documentElement.scrollTop;
        page_end_y = ev.changedTouches[0].clientY;
        page_y = page_end_y - page_st_y;
        if (scroll_top == 0 && page_y > 30)
            $(".mall-head").css("display", "block");
        if (page_y < -30) {
            $(".mall-head").css("display", "none");
            $("#search").css("display", "block");
        }
    }, false);
}
function search_goods() {
    /**
     * 搜索框功能
     */
    $('#search-in').on('keyup', function (event) {  /*监听键盘事件*/
        var search_in = $('#search-in').val();
        if (search_in != "") {  /*搜索框有值则显示差号*/
            $("#search-in+span").css("display", "inline");
        }
        else {  /*搜索框没有值则显示标签并去掉差号,然后显示进口畅饮的商品*/
            $(".ul-con").show();
            $("#search-in+span").css("display", "none");
            $("div[title=1]").show();
        }
        if (event.keyCode == "13") {    /*回车执行查询*/
            var key_words = $("#search-in").val();
            $(".ul-con").hide();
            /*隐藏标签*/
            var a = $(".beer-item");
            for (var i = 0; i < a.length; i++) {
                var p_name = a[i]["children"][1]["innerText"];
                /*获取商品名*/
                if (p_name.indexOf(key_words) < 0) {
                    $(a[i]).hide();
                    /*当前对象不是要查找的对象,则隐藏该对象*/
                }
            }
        }
    });
    $('#search-in+span').on('tap', function () {    /*监听差号事件*/
        $('#search-in').val("");
        $('#search-in').blur();
        $("#search-in+span").css("display", "none");
        $(".ul-con").show();
        $("div[title=1]").show();
    });


}

function wx_pay() {
    /**
     * 微信支付
     */
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
        alert("请输入地址！");
        return;
    }
    if (!check_time1)
        return;
    var ordersubmit = $("#ordersubmit").serialize();

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
                    $.post('/mall/wxcashcancel');
                } else {
                    window.location.href = 'http://wp.beerwhere.cn/wechat/shopping/orderDetails?orderid=' + orderid;
                }
            });
        }
    });
}

function draw_canvas() {
    var c_width = document.body.scrollWidth;
    var c_height = document.body.scrollHeight;
    var canvas = $("#loading_canvas");
    canvas.css({"width": c_width, "height": c_height});
    var ctx = document.getElementById("loading_canvas").getContext("2d");
    ctx.beginPath();
    var w = c_width / 2;
    ctx.arc(100, 100, 100, 0, Math.PI * 2, true);
    ctx.strokeStyle = "green";
    ctx.stroke();
    ctx.closePath();
}

