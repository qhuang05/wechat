/**
 * Created by hqh on 15/12/28.
 */

$(function(){

});

//收藏商品
function enableCollect(goodid,target) {
    var goodid = goodid;
    $.ajax({
        //type: '',
        url: '/mine/enableCollect',
        data:{id:goodid},
        success: function(data){
            if (data=='1') {
                //$('#col_status img').attr('src','/static/weixin/Images/wp_v3/icon_activity.png');
                //$('#col_status span').text('已收藏');
                //$('#col_status input').val('0');
                $(target).attr('src','/static/weixin/Images/wp_v3/btn_pre_collection.png');
                $(target).next().text('已收藏');
                $(target).prev().val('0');
            }
        }
    });
}

//取消收藏商品
function disableCollect(goodid,target) {
    var goodid = goodid;
    $.ajax({
        //type: '',
        url: '/mine/disableCollect',
        data:{id:goodid},
        success: function(data){
            if (data=='1') {
                //$('#col_status img').attr('src', '/static/weixin/Images/wp_v3/icon_order.png');
                //$('#col_status span').text('未收藏');
                //$('#col_status input').val('1');
                $(target).attr('src','/static/weixin/Images/wp_v3/btn_xiangqingye_shoucang.png');
                $(target).next().text('未收藏');
                $(target).prev().val('1');
            }
        }
    });
}

//切换收藏状态为收藏'0'或取消收藏'1'
function isCollect(goodid,target) {
    //var flag = $('#col_status input').val();
    var flag = $(target).prev().val();      //'0'表示收藏状态, '1'表示未收藏状态
    if(flag=='0') {
        disableCollect(goodid,target);
    }
    else {
        enableCollect(goodid,target);
    }
}
