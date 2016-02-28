$(document).ready(function () {
    GetProductClass();
    GetProducts();
    getmedaltypechange();       //勋章类型改变
    getmedaldetailschange();    //勋章米西改变
    madelDetail.init();

});
var className = null;
function GetProductClass() {
    $.ajax({
        type: "post",
        url: 'units/orders/commodityType',
        data: null,
        success: function (data) {
            data = eval("(" + data + ")");
            className = data;
        }
    });
}
var products = null;
function GetProducts() {
    $.ajax({
        type: "post",
        url: 'units/orders/commodityProduct',
        data: null,
        success: function (data) {
            data = eval("(" + data + ")");
            products = data;
        }
    });
}

function getmedaltypechange(){
    $("#medaltype_pupo").combobox({
            onChange: function (n,o) {
                $('#medaldetails_pupo').combobox('reload','/units/medal/codes?medalcode='+n);
        }
    });
}

function getmedaldetailschange(){
    $("#medaldetails_pupo").combo({
            onChange: function (n,o) {
                if(n=='01'){
                    $('#aa').accordion('select','单品消费');
                }
                if(n=='02'){
                    $('#aa').accordion('select','多品消费');
                }
                if(n=='03'){
                    $('#aa').accordion('select','消费瓶数');
                }
                if(n=='04'){
                    $('#aa').accordion('select','消费积分');
                }
                if(n=='05'){
                    $('#aa').accordion('select','消费频次');
                }
                if(n=='06'){
                    $('#aa').accordion('select','签到');
                }
        }
    });
}


(function ($) {
    function pagerFilter(data) {
        if ($.isArray(data)) {	// is array
            data = {
                total: data.length,
                rows: data
            }
        }
        var dg = $(this);
        var state = dg.data('datagrid');
        var opts = dg.datagrid('options');
        if (!state.allRows) {
            state.allRows = (data.rows);
        }
        var start = (opts.pageNumber - 1) * parseInt(opts.pageSize);
        var end = start + parseInt(opts.pageSize);
        data.rows = $.extend(true, [], state.allRows.slice(start, end));
        return data;
    }

    var loadDataMethod = $.fn.datagrid.methods.loadData;
    $.extend($.fn.datagrid.methods, {
        clientPaging: function (jq) {
            return jq.each(function () {
                var dg = $(this);
                var state = dg.data('datagrid');
                var opts = state.options;
                opts.loadFilter = pagerFilter;
                var onBeforeLoad = opts.onBeforeLoad;
                opts.onBeforeLoad = function (param) {
                    state.allRows = null;
                    return onBeforeLoad.call(this, param);
                }
                dg.datagrid('getPager').pagination({
                    onSelectPage: function (pageNum, pageSize) {
                        opts.pageNumber = pageNum;
                        opts.pageSize = pageSize;
                        $(this).pagination('refresh', {
                            pageNumber: pageNum,
                            pageSize: pageSize
                        });
                        dg.datagrid('loadData', state.allRows);
                    }
                });
                $(this).datagrid('loadData', state.data);
                if (opts.url) {
                    $(this).datagrid('reload');
                }
            });
        },
        loadData: function (jq, data) {
            jq.each(function () {
                $(this).data('datagrid').allRows = null;
            });
            return loadDataMethod.call($.fn.datagrid.methods, jq, data);
        },
        getAllRows: function (jq) {
            return jq.data('datagrid').allRows;
        }
    })


})(jQuery);


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

var details_mmg = null;

var editIndex = undefined;


var madelDetail = function () {
    return {
        init: function () {
            var popu = $("#popu").val();
            if (popu == '1'){
                alert('提交成功！');
                _mmg = $('#dg').datagrid({
                    url: '/medalPage',
                    params: $("#medalForm").serialize(),
                    method: 'post',
                    dataType: 'json',
                    pagination: true,
                    pageSize: 15,
                    pageList: [10, 15, 20],
                    columns: [
                        [
                            {field: 'ck', checkbox: true},
                            {field: 'id', title:'id', hidden: true},
                            {field: 'medalname', title:'勋章名称', width:100, type: 'String'},
                            {
                                field: 'medaltype', title:'勋章类型', width:200, type: 'String', formatter: function(val)
                                {
                                    if(val == '')
                                        return '';
                                    else if (val == '1')
                                        return '产品';
                                    else if (val == '2')
                                        return '消费';
                                    else if (val == '3')
                                        return '签到'
                                }
                            },
                            {
                                field: 'medaldetails', title: '明细类型', width:200, type: 'String', formatter: function(val)
                                {
                                    if(val == '')
                                        return '';
                                    else if (val == '01')
                                        return '单品消费';
                                    else if (val == '02')
                                        return '多品消费';
                                    else if (val == '03')
                                        return '消费瓶数';
                                    else if (val == '04')
                                        return '消费积分';
                                    else if (val == '05')
                                        return '消费频次';
                                    else if (val == '06')
                                        return '签到'
                                }
                            },
                            {field: 'remark', title:'备注', width:100, type: 'String'},
                            {field: 'createTime', title:'创建时间', width:100, type: 'String'}
                        ]
                    ]
                }).datagrid("clientPaging");
                return;
            }
            if (popu == '0'){
                alert('提交失败！');
                madelDetail.closePopu();
            }

            if (popu == null || popu == undefined || popu == ""){
                _mmg = $('#dg').datagrid({
                    url: '/medalPage',
                    params: $("#medalForm").serialize(),
                    method: 'post',
                    dataType: 'json',
                    pagination: true,
                    pageSize: 15,
                    pageList: [10, 15, 20],
                    columns: [
                        [
                            {field: 'ck', checkbox: true},
                            {field: 'id', title:'id', hidden: true},
                            {field: 'medalname', title:'勋章名称', width:100, type: 'String'},
                            {
                                field: 'medaltype', title:'勋章类型', width:200, type: 'String', formatter: function(val)
                                {
                                    if(val == '')
                                        return '';
                                    else if (val == '1')
                                        return '产品';
                                    else if (val == '2')
                                        return '消费';
                                    else if (val == '3')
                                        return '签到'
                                }
                            },
                            {
                                field: 'medaldetails', title: '明细类型', width:200, type: 'String', formatter: function(val)
                                {
                                    if(val == '')
                                        return '';
                                    else if (val == '01')
                                        return '单品消费';
                                    else if (val == '02')
                                        return '多品消费';
                                    else if (val == '03')
                                        return '消费瓶数';
                                    else if (val == '04')
                                        return '消费积分';
                                    else if (val == '05')
                                        return '消费频次';
                                    else if (val == '06')
                                        return '签到'
                                }
                            },
                            {field: 'remark', title:'备注', width:100, type: 'String'},
                            {field: 'createTime', title:'创建时间', width:100, type: 'String'}
                        ]
                    ]
                }).datagrid("clientPaging");
            }
        },


        formatProductName: function (value) {
            for (var i = 0; i < products.length; i++) {
                if (products[i].ID == value) {
                    return products[i].PRODUCT_NAME;
                }
            }
        },


        getProductName: function (data, value) {
            var row = $('#details_dg').datagrid('getSelected');
            var rowIndex = $('#details_dg').datagrid('getRowIndex', row);//获取行号
            var target = $('#details_dg').datagrid('getEditor', {
                index: rowIndex,
                field: 'articleName'
            });
            if (data == null) {
                data = $(target.target).combobox('getValue');
            }

            $.ajax({
                type: "post",
                url: 'units/orders/commodityName',
                data: {articleId: data.value},
                success: function (data1) {
                    data1 = eval("(" + data1 + ")");
                    $(target.target).combobox({
                        valueField: 'value1',
                        textField: 'text1',
                        panelHeight: 'auto',
                        data: data1
                    });
                    $(target.target).combobox('setValue', text1);

                }
            });
        },
        //新增_弹出框
        addPopu: function (id, val, orderType) {

            $('#w').window('open');
        },

        //查看订单详情
        editPopu: function (orderId, orderType) {



        },
        //订单详情
        detail: function (id, orderType) {


        },

        removeit1: function () {
            if (editIndex == undefined) {
                return
            }
            $('#details_dg').datagrid('cancelEdit', editIndex)
                .datagrid('deleteRow', editIndex);
            editIndex = undefined;
        },

        //保存商品记录
        accept: function () {
            details_mmg.datagrid('endEdit', editIndex);
            $('#details_dg').datagrid('acceptChanges');
            var rows = $('#details_dg').datagrid('getRows')//获取当前的数据行
            var count = 0;
            var price = 0.00;
            var totie = 0;
            var zprice = 0;
            for (var i = 0; i < rows.length; i++) {
                count = 0;
                price = 0.00;
                totie = 0;

                count += rows[i]['articleCount'];       //获取选中行数量
                price += rows[i]['articleMoney'];       //获取选中行商品单价
                sprice = parseInt(count) * parseInt(price);
                totie = $("#orderMoney").val();


                if (totie == "" || totie == undefined || totie == null) {
                    $("#orderMoney").val(sprice);
                } else {
                    zprice = sprice + zprice;
                    $("#orderMoney").val(zprice);
                }
            }
        },
        //编辑商品
        endEditing: function () {
            //开启编辑
            details_mmg.datagrid("beginEdit", editIndex);
            madelDetail.getProductName(null);
        },

        //编辑商品
        endEditing1: function () {
            if (editIndex == undefined) {
                return true
            }
            if ($('#details_dg').datagrid('validateRow', editIndex)) {
                var ed = $('#details_dg').datagrid('getEditor', {index: editIndex, field: 'articleType'});
                var articleType = $(ed.target).combobox('getValue');
                $('#details_dg').datagrid('getRows')[editIndex]['articleType'] = articleType;
                $('#details_dg').datagrid('endEdit', editIndex);
                editIndex = undefined;
                return true;
            } else {
                return false;
            }
        },

        //关闭_弹出框
        closePopu: function () {
            madelDetail.clearForm('unload');
            $('#w').window('close', true);

        },

        //查询
        load: function () {
            var medalname = $("#medalname").val();
            var medaltype = $("#medaltype").combobox('getValue');
            var medaldetails = $("#medaldetails").datetimebox('getValue');
            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');


            $('#dg').datagrid('load', {
                medalname: medalname,
                medaltype: medaltype,
                medaldetails: medaldetails,
                firsttime: firsttime,
                lasttime: lasttime

            });
        },

        //保存
        save: function () {
            var medalid = $("#medalid").val();
            var medalname = $("#medalname_pupo").val();
            var medaltype = $("#medaltype_pupo").combobox('getValue');
            var medaldetails = $("#medaldetails_pupo").combobox('getValue');

            if (medalname == null || medalname == undefined || medalname == ""){
                alert("未设置勋章名称! 请选择！");
                return;
            }

            if (medaltype == null || medaltype == undefined || medaltype == ""){
                alert("未选择勋章类型！请选择！");
                return;
            }

            if (medaldetails==null || medaldetails==undefined || medaldetails==""){
                alert("未选择勋章明细类型！请选择！");
                return;
            }

            $("#medalPopu").submit();
            return;


        },

        //删除
        del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var orderId;
            var orderIds = [];
            var ids;
            if (chackedItem.length == '0') {
                alert("请至少选择一条记录！");
                return;
            }

            $.messager.confirm('确认', '您确定要删除当前选中的' + chackedItem.length + '条记录吗？', function (r) {
                if (r) {
                    if (chackedItem.length == 1) {
                        var chackedItem1 = $('#dg').datagrid('getChecked');
                        var names = [];
                        var orderId;
                        $.each(chackedItem1, function (index, item) {
                            orderId = item.id;

                        });
                        $.ajax({

                            type: 'POST',
                            url: '/delOrderById',
                            data: 'id=' + orderId,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    $('#medalPopu').form('clear');
                                    madelDetail.load();
                                    return;
                                } else {

                                }
                            }
                        })
                    } else {

                        $.each(chackedItem, function (index, item) {
                            if (orderIds == "") {
                                orderIds = "" + item.id + "";
                            } else {
                                orderIds = "" + item.id + "" + "," + orderIds;
                                ids = orderIds.split(',');

                            }
                        });

                        $.ajax({
                            type: 'POST',
                            url: '/delOrder',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    madelDetail.load();
                                    return;
                                } else {
                                    alert('删除失败！');
                                    return;
                                }
                            }
                        })
                    }
                }
            });
        },

        del1: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var orderId;
            var orderIds = [];
            var ids;
            if (chackedItem.length == '0') {
                alert("请至少选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                if (orderIds == "") {
                    orderIds = "" + item.id + "";
                } else {
                    orderIds = "" + item.id + "" + "," + orderIds;
                    ids = orderIds.split(',');

                }
            });
            alert(ids)
            alert("你确定删除这" + chackedItem.length + "条记录吗？");
            $.ajax({
                type: 'POST',
                url: '/delOrder',
                data: 'id=' + JSON.stringify(ids),
                success: function (result) {
                    if (result == '1') {
                        alert('删除成功！');
                        madelDetail.load();
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
                    if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file" || type == "hidden")
                        this.value = '';
                    else if (type == 'checkbox' || type == 'radio')
                        this.checked = false;
                    else if (tag == 'select')
                        this.selectedIndex = '0';
                });
                var item = $('#details_dg').datagrid('getRows');
                if (item) {
                    for (var i = item.length - 1; i >= 0; i--) {
                        var index = $('#details_dg').datagrid('getRowIndex', item[i]);
                        $('#details_dg').datagrid('deleteRow', index);
                    }
                }
            });
            $('#dg').datagrid('load', {});
        }
    }
}()

