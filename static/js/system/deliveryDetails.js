$(document).ready(function () {
    GetShipName();
    deliveryDetails.init();

});
var shipName = null;
function GetShipName() {
    $.ajax({
        type: "post",
        url: '/customer/getShipName',
        data: null,
        success: function (data) {
            data = eval("(" + data + ")");
            shipName = data;
        }
    });
}
/*(function($){
 function pagerFilter(data){
 if ($.isArray(data)){	// is array
 data = {
 total: data.length,
 rows: data
 }
 }
 var dg = $(this);
 var state = dg.data('datagrid');
 var opts = dg.datagrid('options');
 if (!state.allRows){
 state.allRows = (data.rows);
 }
 var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
 var end = start + parseInt(opts.pageSize);
 data.rows = $.extend(true,[],state.allRows.slice(start, end));
 return data;
 }

 var loadDataMethod = $.fn.datagrid.methods.loadData;
 $.extend($.fn.datagrid.methods, {
 clientPaging: function(jq){
 return jq.each(function(){
 var dg = $(this);
 var state = dg.data('datagrid');
 var opts = state.options;
 opts.loadFilter = pagerFilter;
 var onBeforeLoad = opts.onBeforeLoad;
 opts.onBeforeLoad = function(param){
 state.allRows = null;
 return onBeforeLoad.call(this, param);
 }
 dg.datagrid('getPager').pagination({
 onSelectPage:function(pageNum, pageSize){
 opts.pageNumber = pageNum;
 opts.pageSize = pageSize;
 $(this).pagination('refresh',{
 pageNumber:pageNum,
 pageSize:pageSize
 });
 dg.datagrid('loadData',state.allRows);
 }
 });
 $(this).datagrid('loadData', state.data);
 if (opts.url){
 $(this).datagrid('reload');
 }
 });
 },
 loadData: function(jq, data){
 jq.each(function(){
 $(this).data('datagrid').allRows = null;
 });
 return loadDataMethod.call($.fn.datagrid.methods, jq, data);
 },
 getAllRows: function(jq){
 return jq.data('datagrid').allRows;
 }
 })
 })(jQuery);*/

function refer() {
    $("userDetails").submit();
}

function getData() {
    var rows = [];
    for (var i = 1; i <= 800; i++) {
        var amount = Math.floor(Math.random() * 1000);
        var price = Math.floor(Math.random() * 1000);
        rows.push({
            inv: "No" + i,
            date: $.fn.datebox.defaults.formatter(new Date()),
            name: 'Name ' + i,
            amount: amount,
            price: price,
            cost: amount * price
        });
    }
    return rows;
}

var _mmg = null;

var deliveryDetails = function () {
    return {
        init: function () {
            _mmg = $('#dg').datagrid({
                url: '/deliveryPage',
                params: $("#deliveryInputForm").serialize(),
                method: 'post',
                pagination: true,
                pageSize: 15,
                pageList: [10, 15, 20],
                columns: [
                    [
                        {field: 'ck', checkbox: true},
                        {field: 'id', title: 'id', hidden: true},
                        {field: 'deliveryCode', title: '登陆名', width: 100},
                        {field: 'deliveryName', title: '用户名', width: 100},
                        {field: 'deliveryTel', title: '联系电话', width: 100},
                        {field: 'shipName', title: '所属配送站', width: 100},
                        /*formatter:
                         function(val1){
                         if(val1=='5')
                         return '将军祠配送站';
                         else if(val1=='6')
                         return '莲坂外图';
                         else if(val1=='7')
                         return '瑞景配送点';
                         else if(val1=='8')
                         return '寨上配送点';
                         else if(val1=='9')
                         return '测试配送站';
                         else if(val1=='10')
                         return '火车站';
                         }},*/
                        /*{field:'shipName', title:'所属配送站', width:100,formatter:
                         function (value) {
                         for (var i = 0; i < shipName.length; i++) {
                         if (shipName[i].value == value) {
                         return shipName[i].text;
                         }
                         }
                         }},*/
                        {field: 'createTime', title: '创建时间', width: 100},
                        {
                            field: 'deliveryStatus', title: '配送员状态', width: 100, formatter: function (val) {
                            if (val == '')
                                return '';
                            else if (val == '01')
                                return '在线';
                            else if (val == '02')
                                return '离线';
                        }
                        }
                    ]
                ]
            }).datagrid("clientPaging");
        },

        //打开弹出框
        openPopu: function (val) {
            if (val == '1') {
                //配送站赋值
                deliveryDetails.listShip();
                //$('#zone').combobox(
                //    {
                //        url:'/customer/zone',
                //        valueField:'value',
                //        textField:'text',
                //        method:'POST'
                //    }
                //)
                $('#w').window('open');
            } else {
                $('#w').window('open');
            }
        },

        //配送站combox 初始化
        listShip: function () {
            $('#zone').combobox(
                {
                    url: '/customer/zone',
                    valueField: 'value',
                    textField: 'text',
                    method: 'POST'
                }
            )
        },

        //查询
        load: function () {
            var deliverycode = $("#deliverycode").val();
            var delitel = $("#delitel").val();
            var shipname = $("#shipname").combobox('getValue');
            var firsttime =$("#firsttime").datetimebox('getValue');
            var lasttime =$("#lasttime").datetimebox('getValue');
            $('#dg').datagrid('load', {
                deliverycode: deliverycode,
                delitel: delitel,
                shipname: shipname,
                firsttime:firsttime,
                lasttime:lasttime
            });
        },

        //关闭弹出框
        closePopu: function () {
            deliveryDetails.clearForm('deliveryDetails');
            $('#w').window('close');
        },

        //保存
        save: function () {
            var id = $("#id").val();
            var params = $("#deliveryDetails").serialize();

            if (id == "" || id == undefined || id == null) {
                //新增
                if (params.length == 0) {
                    alert("请输入配送员详细信息！");
                }
                if ($("#deliveryCode").val() == null || $("#deliveryCode").val() == undefined) {
                    alert("请输入登陆名！");
                }
                if ($("#deliveryName").val() == null || $("#deliveryName").val() == undefined) {
                    alert("请输入姓名！");
                }
                if ($("#zone").val() == null || $("#zone").val() == undefined) {
                    alert("请选择配送区！");
                }
                if ($("#deliveryTel").val() == null || $("#deliveryTel").val() == undefined) {
                    alert("请输入联系电话！");
                }
                if ($("#deliveryPws").val() == null || $("#deliveryPws").val() == undefined) {
                    alert("请输入密码！");
                }
                $.ajax({
                    type: 'POST',
                    url: '/addDelivery',
                    dataType: 'json',
                    data: params,
                    success: function (result) {
                        if (result == '1') {
                            alert('保存成功！');
                            deliveryDetails.load();
                            deliveryDetails.clearForm('deliveryDetails');
                            deliveryDetails.closePopu();
                            return;
                        } else {
                            alert('保存失败！');
                            deliveryDetails.closePopu();
                            return;
                        }
                    }

                })
            } else {
                //更新
                if (params.length == 0) {
                    alert("请输入配送员详细信息！");
                }
                if ($("#deliveryCode").val() == null || $("#deliveryCode").val() == undefined || $("#deliveryCode").val() == "") {
                    alert("请输入登陆名！");
                }
                if ($("#deliveryName").val() == null || $("#deliveryName").val() == undefined || $("#deliveryName").val() == "") {
                    alert("请输入姓名！");
                }
                if ($("#deliveryTel").val() == null || $("#deliveryTel").val() == undefined || $("#deliveryTel").val() == "") {
                    alert("请输入联系电话！");
                }
                $.ajax({
                    type: 'POST',
                    url: '/eidtDelivery',
                    dataType: 'json',
                    data: params,
                    success: function (result) {
                        if (result == '1') {
                            alert('修改成功！');
                            deliveryDetails.load();
                            deliveryDetails.clearForm('deliveryDetails');
                            deliveryDetails.closePopu();
                            return;
                        } else {
                            alert('修改失败！');
                            deliveryDetails.closePopu();
                            return;
                        }
                    }

                })
            }
        },
        //删除配送员
        del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var deliveryId;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                deliveryId = item.id;
            });

            $.ajax({
                type: 'POST',
                url: '/delDelivery',
                data: 'id=' + deliveryId,
                success: function (result) {
                    if (result == '1') {
                        alert('删除成功！');
                        /*deliveryDetails.load();*/
                        deliveryDetails.clearForm('deliveryInputForm')
                        return;
                    } else {
                        alert('删除失败！');
                        return;
                    }
                }
            })
        },

        //清空表单
        clearForm: function (formID) {
            $("#" + formID).each(function () {
                // iterate the elements within the form
                $(':input', this).each(function () {
                    var type = this.type, tag = this.tagName.toLowerCase();
                    if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file")
                        this.value = '';
                    else if (type == 'checkbox' || type == 'radio')
                        this.checked = false;
                    else if (tag == 'select')
                        this.selectedIndex = '0';
                });
            });
            $('#dg').datagrid('load', {});
        },


        //更新编辑
        edit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var deliveryid;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                deliveryid = item.id;
            });

            $.post('/selectDelivery', {id: deliveryid}, function (result) {
                if (result != null) {
                    deliveryDetails.listShip();
                    $("#id").val(result[0].id);
                    $("#deliveryCode").val(result[0].deliveryCode);
                    $("#deliveryName").val(result[0].deliveryName);
                    $("#zone").combobox('setValue', result[0].shipId);
                    $("#deliveryTel").val(result[0].deliveryTel);
                    $("#deliveryPws").val(result[0].deliveryPws);
                    $('#deliveryPws').attr("readonly", true);
                    $("#deliveryStatus").combobox('setValue', result[0].deliveryStatus);
                    /*if(result[0].deliveryStatus=='01'){
                     $("#deliveryStatus").combobox('setValue','01');
                     }else if(result[0].deliveryStatus=='02'){
                     $("#deliveryStatus").combobox('setValue','01');
                     }*/
                }

            }, 'json');
            deliveryDetails.openPopu('0');

        },

        //重置
        deliveryreset: function(){
            $.ajax({
                type: 'POST',
                url: '/delDelivery/Reset',
                success: function (result) {
                    if (result == '1') {
                        alert('配送数重置成功！');
                        return;
                    } else {
                        alert('配送数重置失败！');
                        return;
                    }
                }
            })
        }


    }
}()