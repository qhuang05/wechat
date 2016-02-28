/**
 * Created by Russell on 16/1/8.
 */

$(function () {
    $("nav li:first-child").css("color", "#D9A633");    //进入页面第一个tab亮起
    $("nav>ul").on("click", "li", function (e) {
        /**
         * nav>ul>li绑定事件
         * @type {*|jQuery}
         */
        var tab_name = $(this).text();
        change_tab(tab_name, this);   //tab动画
        document.getElementById("move_div").addEventListener("webkitAnimationEnd", function () {
            show_hide(tab_name);  //显示或隐藏勋章
        });
    });

    $("#container").find("li").each(function () {
        /**
         * 取消已拥有勋章的模糊效果
         * @type {*|jQuery}
         */
        var show_not = $(this).val();
        if (show_not == '0') {
            $(this).find("img").css("opacity", "1");
        }
    });
});

function change_tab(tab_name, target) {
    /**
     * tab动画
     * @type {*|jQuery|HTMLElement}
     */
    var move_div = $("nav>div");
    var line_position = parseInt(move_div.css("margin-left").split("p")[0]);
    var tab_width = parseInt(document.body.clientWidth / 3);
    $("nav li").css("color", "#000");
    $(target).css("color", "#D9A633");
    //console.log(tab_name.indexOf("已获得"));
    //css3动画
    if (line_position >= 0 && line_position < tab_width) {   //判断当前下划线的位置(左中右)
        if (tab_name.indexOf("已获得") > -1) {   //判断当前点击的li
            move_div.css({"animation": "move-ltm 0.22s forwards", "-webkit-animation": "move-ltm 0.22s forwards"});
        } else if (tab_name.indexOf("未获得") > -1) {
            move_div.css({"animation": "move-ltr 0.22s forwards", "-webkit-animation": "move-ltr 0.22s forwards"});

        }
    } else if (line_position < 2 * tab_width && line_position >= tab_width) {    //中
        if (tab_name.indexOf("全部") > -1) {   //判断当前点击的li
            move_div.css({"animation": "move-mtl 0.22s forwards", "-webkit-animation": "move-mtl 0.22s forwards"});
        } else if (tab_name.indexOf("未获得") > -1) {
            move_div.css({"animation": "move-mtr 0.22s forwards", "-webkit-animation": "move-mtr 0.22s forwards"});
        }
    } else {    //右
        if (tab_name.indexOf("全部") > -1) {   //判断当前点击的li
            move_div.css({"animation": "move-rtl 0.22s forwards", "-webkit-animation": "move-rtl 0.22s forwards"});
        } else if (tab_name.indexOf("已获得") > -1) {
            move_div.css({"animation": "move-rtm 0.22s forwards", "-webkit-animation": "move-rtm 0.22s forwards"});
        }
    }


}

function show_hide(tab_name) {
    /**
     * 显示或隐藏勋章
     */
    if (tab_name.indexOf("已获得") > -1) {    //每个tab下显示的内容
        $("#container li").show();
        $("#container li").each(function () {
            if ($(this).attr("value") == "1") {
                $(this).hide();
            }
        });
    } else if (tab_name.indexOf("未获得") > -1) {
        $("#container li").show();
        $("#container li").each(function () {
            if ($(this).attr("value") == "0") {
                $(this).hide();
            }
        });
    } else
        $("#container li").show();
}

function show_detail(target) {
    var medal_id = $(target).attr("id");
    window.location.href = "/medal/detail/" + medal_id;
}