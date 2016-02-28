/**
 * Created by ldj on 15/12/28.
 */
$(document).ready(

    function () {
        (new CenterImgPlay()).Start();
        var a = $("ul > li").length-4;
        $("#xuhao").text("1/"+a);

    }
);
    function CenterImgPlay() {
        var a = $("ul > li").length-4;
        this.list = $(".imgbox").children(":first").children();
        this.indexs = [];
        this.length = this.list.length;
        //图片显示时间
        this.timer = 3000;
        this.showTitle = $(".title");
        this.showTitle.text($("#titleText").attr("title"));

        var index = 0, self = this, pre = 0, handid, isPlay = false, isPagerClick = false;

        this.Start = function () {
            this.Init();
            //计时器，用于定时轮播图片
            handid = setInterval(self.Play, this.timer);
        };
        //初始化
        this.Init = function () {
            var o = $(".pager ul li"), _i;

            for (var i = 3, n = 0; i >= 0; i--, n++) {
                this.indexs[n] = o.eq(i);
            }
        };
        this.Play = function () {
            isPlay = true;
            index++;
            if (index == self.length) {
                index = 0;
            }
            //先淡出，在回调函数中执行下一张淡入
            self.list.eq(pre).fadeOut(300, "linear", function () {
                var info = self.list.eq(index).fadeIn(500, "linear", function () {
                    isPlay = false;
                }).attr("title");
                //显示标题
                self.showTitle.text(info);
                //图片序号背景更换

                $(".pager ul li").text((index+1)+"/"+a);

                pre = index;
            });
        };

    }
// 窗口滚动检测
$(function(){
    var obj = document.getElementById('goTop');
    var scrollTop = null;

    // 置顶对象点击事件
    obj.onclick = function() {
        var timer = setInterval(function() {
            window.scrollBy(0, -100);
            if (scrollTop == 0)
                clearInterval(timer);
        }, 2);
    };

    window.onscroll = function() {
    scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    obj.style.display = (scrollTop >= 10) ? "block" : "none";
};
});
//div点击跳转
function checkJump(val){
    var a = val.id.substring(5);
    window.location.href='/wechat/index/detailForIndex?checkNum='+a;
}
