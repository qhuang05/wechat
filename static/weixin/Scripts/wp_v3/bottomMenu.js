/**
 * Created by hqh on 15/12/30.
 */

$(document).ready(function () {
    $('#bottom-menu li a').eq(0).click(function () {
        indexSelected();
    });
    $('#bottom-menu li a').eq(1).click(function () {
        mallSelected();
    });
    $('#bottom-menu li a').eq(2).click(function () {
        mineSelected();
    });

    var menuFlag = $('#menuFlag').val();        //菜单标识，'1'首页; '2'商城; '3'我的
    //alert(menuFlag);
    switch (menuFlag) {
        case '1':
            indexSelected();
            break;
        case '2':
            mallSelected();
            break;
        case '3':
            mineSelected();
            break;
    }
});

function indexSelected() {
    $('#bottom-menu li a').removeClass('menu-active');
    $('#bottom-menu li a').eq(0).addClass('menu-active');
    $('#bottom-menu li a').eq(0).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_pre_home.png');
    $('#bottom-menu li a').eq(1).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_store.png');
    $('#bottom-menu li a').eq(2).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_personal.png');
}
function mallSelected() {
    $('#bottom-menu li a').removeClass('menu-active');
    $('#bottom-menu li a').eq(1).addClass('menu-active');
    $('#bottom-menu li a').eq(1).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_pre_store.png');
    $('#bottom-menu li a').eq(0).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_home.png');
    $('#bottom-menu li a').eq(2).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_personal.png');
}
function mineSelected() {
    $('#bottom-menu li a').removeClass('menu-active');
    $('#bottom-menu li a').eq(2).addClass('menu-active');
    $('#bottom-menu li a').eq(2).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_pre_personal.png');
    $('#bottom-menu li a').eq(0).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_home.png');
    $('#bottom-menu li a').eq(1).find('img').attr('src', '../../../static/weixin/Images/wp_v3/icon_store.png');
}