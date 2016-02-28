/**
 * Created by hqh on 15/12/28.
 */

$(function () {
    change_data();
    var flag = $('#col_status input').val();        //'0'表示收藏状态, '1'表示未收藏状态(之前有收藏过的记录), none表示该商品没有被收藏过
    if (flag == '0') {
        $('#col_status img').attr('src', '/static/weixin/Images/wp_v3/btn_pre_collection.png');
    }
    else {
        $('#col_status img').attr('src', '/static/weixin/Images/wp_v3/btn_xiangqingye_shoucang.png');
    }
});

//收藏商品
function enableCollect(goodid, target) {
    var goodid = goodid;
    $.ajax({
        //type: '',
        url: '/mine/enableCollect',
        data: {id: goodid},
        success: function (data) {
            if (data == '1') {
                $(target).attr('src', '/static/weixin/Images/wp_v3/btn_pre_collection.png');
                $(target).prev().val('0');
            }
        }
    });
}

//取消收藏商品
function disableCollect(goodid, target) {
    var goodid = goodid;
    $.ajax({
        //type: '',
        url: '/mine/disableCollect',
        data: {id: goodid},
        success: function (data) {
            if (data == '1') {
                $(target).attr('src', '/static/weixin/Images/wp_v3/btn_xiangqingye_shoucang.png');
                $(target).prev().val('1');
            }
        }
    });
}

//添加到用户的收藏列表里(之前没有收藏过此商品的记录)
function addCollect(goodid, target) {
    var goodid = goodid;
    $.ajax({
        //type: '',
        url: '/mine/addCollect',
        data: {id: goodid},
        success: function (data) {
            if (data == '1') {
                $(target).attr('src', '/static/weixin/Images/wp_v3/btn_pre_collection.png');
                $(target).prev().val('0');
            }
        }
    });
}

//切换收藏状态为收藏'0'或取消收藏'1'或添加到收藏列表里(首次添加)
function isCollect(goodid, target) {
    var flag = $('#col_status input').val();
    if (flag == 'None') {
        //该商品没有被收藏过的记录
        addCollect(goodid, target);
    }
    else if (flag == '0') {
        disableCollect(goodid, target);
    }
    else {
        enableCollect(goodid, target);
    }
}

//点击结算进入支付页面
function orderSubmit() {
    check_add();
    $(".disabled-input").removeAttr("disabled");
    //window.location.href = '/mall/orderSubmit';
}

function check_add() {
    /**
     * 验证有无添加商品,结算按钮条件验证
     */
    var total = $("#total").val().split(".");
    var good_id = $(".disabled-input").attr('name');
    var type4_bottle = sessionStorage.getItem("count");
    var tolerant_count = parseInt($('#h_' + good_id).val());    //选种商品的默认瓶数
    if (parseInt(type4_bottle) >= tolerant_count) {
        if (total[0] != "0") {
            $("#myform").submit();
        } else {
            alert("您还没选择足够的商品哦");
            return false;
        }
    }
    else if (parseInt(type4_bottle) == 0) {
        if (total[0] != "0") {
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


function change_data() {
    /**
     * 进页面获取sessionStorage的数据并写入当前页
     * @type {*|jQuery|HTMLElement}
     */

    var cart_click = $(".num");  //点击可出现购物车的元素
    var cart_money = $(".money-click"); //底部显示总价的元素
    var cart = $(".totalCount");  //购物车div
    var good_id = $(".disabled-input").attr('name');
    var good_key, good_count, input_str = "";

    var storage = window.sessionStorage;
    var value = storage.getItem(good_id);
    if (value != null) {
        value = value.split(",");
        if (value[0] != 0) {
            $('#' + good_id).val(value[0]);
            cart.css({"display": "inherit", "animation": "pop-cart 1s", "-webkit-animation": "pop-cart 1s"});   //弹出购物车

        }
    }
    $("#total").val(storage.getItem("total"));    //input表单数据
    cart_click.text(storage.getItem("count"));
    cart_money.text(storage.getItem("total"));
    for (var i = 0; i < storage.length; i++) {
        good_key = storage.key(i);
        good_count = storage.getItem(good_key).split(",")[0];
        input_str += '<input type="hidden" id="' + good_key + '" name="' + good_key + '" value="' + good_count + '">';  //拼接input表单节点
    }
    $("#myform").append(input_str); //form表单添加

    $("#bottles-input").on("tap", function (e) {
        /**
         * 绑定tap事件
         */
        var clicked_class = event.target.className;
        var p = $(event.target).parent();   //event.target(指向当前点击对象)和this都是dom对象,可以直接用
        var t = p.find('input[type=text]');
        var tolerant_count = parseInt($('#h_' + good_id).val());//选种商品的默认瓶数
        var ps = $(event.target).parents(".am-container");
        var p_name = ps.find('.text').text().replace(/(^\s*)|(\s*$)/g, "");
        /*找到商品名并去掉空格*/
        var p_price = ps.find('.unit-price').text();
        switch (clicked_class) {
            case "bottle-inc":
                /**
                 * 增加按钮事件
                 * @type {*|jQuery}
                 */
                var num = parseInt(t.val());
                var one_total = 0;  //单个商品金额
                var one_count = 1;  //商品累加基数
                if (num == 0) {
                    num += tolerant_count;
                    //one_count = tolerant_count;
                    //one_total = tolerant_count * parseFloat($(".item-bottom").find('span[class=unit-price]').text());   //单个商品金额计算
                    alt_form_item(good_id, num);
                    /*没添加过该商品则创建新的input到form*/
                }
                else {
                    num++;
                    //one_total = parseFloat($(".item-bottom").find('span[class=unit-price]').text());    //单个商品金额计算
                    alt_form_item(good_id, num);
                    /*没添加过该商品则创建新的input到form*/
                }
                //var all_total = parseFloat(cart_money.text()) + one_total;    //计算总价
                //var all_count = one_count + parseInt(cart_click.text());
                $("input[name=" + good_id + "]").val(num);   //所有对应的输入框瓶数增加
                //cart_click.text(all_count);   //购物车右上角数字增加
                //cart_money.text(all_total.toFixed(1));
                //cart.css({"display": "inherit", "animation": "pop-cart 1s", "-webkit-animation": "pop-cart 1s"});   //弹出购物车
                if (parseInt(t.val()) <= tolerant_count) {
                    t.val(tolerant_count);
                }
                var list_item = [num, tolerant_count, p_name, p_price];   //当前商品瓶数,默认瓶数,商品名,单价
                storage.setItem(good_id, list_item);  //向session中添加商品map
                //storage.setItem("count", all_count);
                //storage.setItem("total", all_total.toFixed(1));
                setTotal();
                break;
            case "bottle-dec":
                /**
                 * 减少按钮
                 * @type {*|jQuery}
                 */
                var num = parseInt(t.val());
                var one_total = 0;  //单个商品金额
                var one_count = 1;  //商品累加基数
                var all_total = 0.0;
                var all_count = 0;
                if (num > tolerant_count) {  //商品数不能小于最小瓶数
                    num--;
                    //one_total = parseFloat($(".item-bottom").find('span[class=unit-price]').text());    //单个商品金额计算
                    $("input[id=" + good_id + "]").val(num);   //所有对应的输入框瓶数
                    //all_total = parseFloat(cart_money.text()) - one_total;    //计算总价
                    //all_count = parseInt(cart_click.text()) - one_count;
                } else if (num == tolerant_count) {
                    num = 0;
                    storage.removeItem(good_id);
                    //one_count = tolerant_count;
                    //one_total = tolerant_count * parseFloat($(".item-bottom").find('span[class=unit-price]').text());   //单个商品金额计算
                    $("input[name=" + good_id + "]").val(0);   //所有对应的输入框瓶数增加
                    t.val(0);
                    //all_total = parseFloat(cart_money.text()) - one_total;    //计算总价
                    //all_count = parseInt(cart_click.text()) - one_count;
                } else if (num == 0) { /*important*/
                    //all_count = parseInt(storage.getItem("count"));
                    //all_total = parseFloat(storage.getItem("total"));
                }
                //cart_click.text(all_count);   //购物车右上角数字增加
                //cart_money.text(all_total.toFixed(1));
                var list_item = [num, tolerant_count, p_name, p_price];   //当前商品瓶数,默认瓶数,商品名,单价
                if (num == 0) {
                    storage.removeItem(good_id);
                } else {
                    storage.setItem(good_id, list_item);
                }
                //storage.setItem("count", all_count);
                //storage.setItem("total", all_total.toFixed(1));
                if (parseInt($(".num").text()) == 0) {
                    cart.css("display", "none");   //隐藏购物车
                }
                setTotal();
                break;
            default:
                break;
        }
    });
    function alt_form_item(good_id, num) {
        /**
         * 点击加号向form添加item
         * @type {*|jQuery}
         */
        if ($("#myform").find("#" + good_id).length == 0) {
            var item = '<input type="hidden" id="' + good_id + '" name="' + good_id + '" value="' + num + '">';
            $("#myform").append(item);
        } else {
            var foc_item = $("#list-container").find("#" + good_id).find("input");
            foc_item.val(num);
        }
    }
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
        cart_money.text(s.toFixed(1));
        $("#total").attr("value", s.toFixed(1));
        $("#myform>#total").attr("value", s.toFixed(1));
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
        cart_click.text(s);
        $("#count").attr("value", s);
        storage.setItem('count', s);
        return s;
    }
}

