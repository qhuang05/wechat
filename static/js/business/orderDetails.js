$(document).ready(function () {
    GetProductClass();
    GetProducts();

    orderDetail.init();

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


var orderDetail = function () {
    return {
        init: function () {
            _mmg = $('#dg').datagrid({
                url: '/orderPage',
                params: $("#orderForm").serialize(),
                method: 'post',
                dataType: 'json',
                pagination: true,
                pageSize: 15,
                pageList: [10, 15, 20],
                columns: [
                    [
                        {field: 'ck', checkbox: true},
                        {field: 'id', title: 'id', hidden: true},
                        {
                            field: 'orderNo',
                            title: '订单编号',
                            width: 180,
                            type: 'String',
                            formatter: function (val, item, rowIndex) {

                                return '<span style=""><a href="#" onclick="orderDetail.detail(\'' + item.id + ',' + item.orderType + '\')">'
                                    + val + '</a></span>'
                            }
                        },
                        {field: 'clientName', title: '订单人姓名', width: 100},
                        {field: 'clientTel', title: '订单电话', width: 100},
                        {field: 'orderAddress', title: '订单地址', width: 250},
                        {field: 'createTime', title: '下单时间', width: 120},
                        {
                            field: 'defrayType', title: '支付方式', width: 80, type: 'String', formatter: function (val) {
                            if (val == '')
                                return '';
                            else if (val == '01')
                                return '在线支付';
                            else if (val == '02')
                                return '货到支付';
                        }
                        },
                        {
                            field: 'defrayStatus',
                            title: '支付状态',
                            width: 100,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '01')
                                    return '已支付';
                                else if (val == '02')
                                    return '未支付';
                                else if (val == '03')
                                    return '预支付';
                            }
                        },
                        {
                            field: 'orderStatus', title: '订单状态', width: 80, type: 'String', formatter: function (val) {
                            if (val == '0')
                                return '新增';
                            else if (val == '01')
                                return '待分配';
                            else if (val == '02')
                                return '已分配';
                            else if (val == '03')
                                return '已完成';
                        }
                        },
                        {
                            field: 'orderType', title: '下单方式', width: 80, type: 'String', formatter: function (val) {
                            if (val == '')
                                return '';
                            else if (val == '01')
                                return '微信';
                            else if (val == '02')
                                return '电话';
                        }

                        }
                    ]
                ]
            }).datagrid("clientPaging");
        },

        //订单详情列表初始化
        orderPupo: function (id) {
            var commodityType = [{"value": "1", "text": "啤酒"}, {"value": "2", "text": "洋酒"}, {
                "value": "3",
                "text": "红酒"
            }];
            var commodityName = [{"value": "01", "text": "科罗纳(啤酒)"}, {"value": "02", "text": "时代(啤酒)"}, {
                "value": "03",
                "text": "乐飞(啤酒)"
            },
                {"value": "04", "text": "福佳(啤酒)"}, {"value": "06", "text": "智美蓝帽"}, {"value": "07", "text": "智美红帽"},
                {"value": "08", "text": "智美白帽"}, {"value": "09", "text": "督威"}, {"value": "10", "text": "粉象-浅"},
                {"value": "11", "text": "粉象-深"}, {"value": "12", "text": "白熊"}, {"value": "13", "text": "罗斯福8号"},
                {"value": "14", "text": "罗斯福10号"}, {"value": "15", "text": "荷兰教堂白"}, {"value": "16", "text": "艾丁格*12瓶"},
                {"value": "17", "text": "雷泽"}, {"value": "18", "text": "文娜玛干红葡萄酒"}, {
                    "value": "19",
                    "text": "智利河流卡本内红葡萄酒"
                }, {"value": "20", "text": "智利河流莎当妮白葡萄酒"}
            ];

            //清空列表结果集
            $('#details_dg').datagrid('loadData', {total: 0, rows: []});
            //列表初始化
            details_mmg = $('#details_dg').datagrid({
                    url: '/orders/detailpage',
                    queryParams: {'id': id},
                    reload: true,
                    method: 'post',
                    dataType: 'json',
                    singleSelect: true,
                    toolbar: '#tb',
                    onClickRow: 'onClickRow',
                    idField: 'id', //主键
                    columns: [
                        [
                            {field: 'id', title: 'id', hidden: true},
                            {
                                field: 'articleType', title: '商品类别', width: 100, editor: {
                                type: 'combobox', options: {
                                    data: className,
                                    valueField: 'value',
                                    textField: 'text',
                                    //method: 'post',
                                    required: true,
                                    panelHeight: 'auto',
                                    onSelect: function (data) {
                                        orderDetail.getProductName(data);
                                    }
                                }
                            }, formatter: function (value, rowIndex, rowData) {
                                for (var i = 0; i < className.length; i++) {
                                    if (className[i].value == value) {
                                        return className[i].text;
                                    }
                                }
                            }
                            },
                            {
                                field: 'articleName', title: '商品名称', width: 150, editor: {
                                type: 'combobox', options: {
                                    width: 150,
                                    onSelect: function (data) {

                                        var row = $('#details_dg').datagrid('getSelected');
                                        var rowIndex = $('#details_dg').datagrid('getRowIndex', row);//获取行号
                                        var target = $('#details_dg').datagrid('getEditor', {
                                            index: rowIndex,
                                            field: 'articleMoney'
                                        });
                                        // $(target.target).combobox('clear'); //清除原来的数据
                                        var value = data.value1;
                                        $.ajax({
                                            type: "post",
                                            url: 'units/orders/commodityUnitPrice',
                                            data: {productName: value},
                                            success: function (data1) {
                                                data1 = eval("(" + data1 + ")");
                                                $(target.target).numberbox('setValue', data1[0].text2);
                                                $(target.target).attr("readonly", true)
                                            }
                                        });

                                    }
                                }
                            }, formatter: function (value, rowIndex, rowData) {
                                /* for (var i = 0; i < products.length; i++) {
                                 if (products[i].ID == value) {
                                 return products[i].PRODUCT_NAME;
                                 }
                                 }*/
                                return orderDetail.formatProductName(value);
                            }
                            },
                            {field: 'articleCount', title: '数量', width: 100, editor: 'numberbox'},
                            {
                                field: 'articleMoney', title: '单价', width: 100, editor: {
                                type: 'numberbox', options: {
                                    width: 100
                                }
                            }
                            }
                        ]
                    ],
                    onClickRow: function (rowIndex, rowData) {
                        if (editIndex == undefined) {
                            editIndex = rowIndex;
                        } else if (rowIndex != editIndex) {
                            details_mmg.datagrid('endEdit', editIndex);
                            editIndex = rowIndex;
                        }
                    }
                }
            )

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
            //$(target.target).combobox('clear'); //清除原来的数据
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

            $("#save").attr("data-options", "iconCls:'icon-ok'");
            $("#save").attr("class", "easyui-linkbutton l-btn");
            if (orderType == '02') {
                //订单编号生成
                if (id == '1') {
                    var d = new Date(), str = '';
                    str += d.getFullYear();
                    str += d.getMonth() + 1;
                    str += d.getDate();
                    str += d.getHours();
                    str += d.getMinutes();
                    str += d.getSeconds();
                    $("#orderno_pupo").val("NOT" + str);
                    $("#orderStatus").combobox('setValue', '待分配');
                    $('#save').show();
                } else {
                    /* $('#save').hide();*/
                }
            } else {
                $('#save').show();
            }
            //orderDetail.mapContainer();
            //配送站赋值
            $('#shipName').combobox(
                {
                    url: '/customer/zone',
                    valueField: 'value',
                    textField: 'text',
                    method: 'POST'
                }
            )
            //订单编号不可编辑
            $("#orderno_pupo").attr("readonly", "readonly");
            //订单总额不可编辑
            $("#orderMoney").attr("readonly", "readonly");
            //订单详情初始化
            orderDetail.orderPupo(val);
            $('#w').window('open');
        },

        //查看订单详情
        editPopu: function (orderId, orderType) {

            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var orderId;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                orderId = item.id;
            });
            $.each(chackedItem, function (index, item) {
                orderType = item.orderType;

            });

            $.post('/orders/detail', {id: orderId}, function (result) {

                if (result != null) {
                    $("#id").val(result[0].orderId);
                    $("#clientId").val(result[0].clientId);
                    $("#orderno_pupo").val(result[0].orderno);
                    $("#clientName").val(result[0].clientName);
                    $("#clientTel").val(result[0].clientTel);
                    $("#clientWachat").val(result[0].clientWachat);
                    $("#orderMoney").val(result[0].orderMoney);
                    $("#walletMoney").val(result[0].walletMoney);
                    $("#zone").combobox('setValue', result[0].zone);
                    $("#orderAddress").val(result[0].orderAddress);
                    $("#orderTime").datebox('setValue', result[0].orderTime);
                    $("#submitTime").datebox('setValue', result[0].submitTime);
                    $("#orderLongitude").val(result[0].orderLongitude);
                    $("#orderLatitude").val(result[0].orderLatitude);
                    if (result[0].appTimeId == '0' || result[0].appTimeId == null) {
                        $("#appTimeId").combobox('setValue', '及时送达');
                    } else if (result[0].appTimeId == '1') {
                        $("#appTimeId").combobox('setValue', '16:00~16:30');
                    } else if (result[0].appTimeId == '2') {
                        $("#appTimeId").combobox('setValue', '16:30~17:00');
                    } else if (result[0].appTimeId == '3') {
                        $("#appTimeId").combobox('setValue', '17:00~17:30');
                    } else if (result[0].appTimeId == '4') {
                        $("#appTimeId").combobox('setValue', '17:30~18:00');
                    } else if (result[0].appTimeId == '5') {
                        $("#appTimeId").combobox('setValue', '18:00~18:30');
                    } else if (result[0].appTimeId == '6') {
                        $("#appTimeId").combobox('setValue', '18:30~19:00');
                    } else if (result[0].appTimeId == '7') {
                        $("#appTimeId").combobox('setValue', '19:00~19:30');
                    } else if (result[0].appTimeId == '8') {
                        $("#appTimeId").combobox('setValue', '19:30~20:00');
                    } else if (result[0].appTimeId == '9') {
                        $("#appTimeId").combobox('setValue', '20:00~20:30');
                    } else if (result[0].appTimeId == '10') {
                        $("#appTimeId").combobox('setValue', '20:30~21:00');
                    } else if (result[0].appTimeId == '11') {
                        $("#appTimeId").combobox('setValue', '21:00~21:30');
                    } else if (result[0].appTimeId == '12') {
                        $("#appTimeId").combobox('setValue', '21:30~22:00');
                    } else if (result[0].appTimeId == '13') {
                        $("#appTimeId").combobox('setValue', '22:00~22:30');
                    } else if (result[0].appTimeId == '14') {
                        $("#appTimeId").combobox('setValue', '22:30~23:00');
                    } else if (result[0].appTimeId == '15') {
                        $("#appTimeId").combobox('setValue', '23:00~23:30');
                    } else if (result[0].appTimeId == '16') {
                        $("#appTimeId").combobox('setValue', '23:30~24:00');
                    }

                    if (result[0].orderStatus == '0') {
                        $("#orderStatus").combobox('setValue', '新增');
                    } else if (result[0].orderStatus == '01') {
                        $("#orderStatus").combobox('setValue', '待分配');
                    } else if (result[0].orderStatus == '02') {
                        $("#orderStatus").combobox('setValue', '已分配');
                    }
                    if (result[0].defrayType == '01') {
                        $("#defrayType").combobox('setValue', '在线支付');
                    } else if (result[0].defrayType == '02') {
                        $("#defrayType").combobox('setValue', '货到支付');
                    }

                    if (result[0].defrayStatus == '01') {
                        $("#defrayStatus").combobox('setValue', '已支付');
                    } else if (result[0].defrayStatus == '02') {
                        $("#defrayStatus").combobox('setValue', '未支付');
                    }

                    if (result[0].orderType == '01') {
                        $("#orderType").combobox('setValue', '微信');
                    } else if (result[0].orderType == '02') {
                        $("#orderType").combobox('setValue', '电话');
                    }

                    $("#remark").val(result[0].remark);

                    $("#shipName").combobox('setValue', result[0].shipName);
                    $('#orderStatus').combobox('disable');
                    orderDetail.addPopu('2', orderId, orderType);

                }
            }, 'json');
            $('#w').window('open');

        },
        //订单详情
        detail: function (id, orderType) {

            $.post('/orders/detail', {id: id}, function (result) {
                if (result != null) {
                    $("#id").val(result[0].orderId);
                    $("#orderno_pupo").val(result[0].orderno);
                    $("#clientName").val(result[0].clientName);
                    $("#clientName").attr("readonly", "readonly");
                    $("#clientTel").val(result[0].clientTel);
                    $("#clientTel").attr("readonly", "readonly");
                    $("#clientWachat").val(result[0].clientWachat);
                    $("#orderMoney").val(result[0].orderMoney);
                    $("#walletMoney").val(result[0].walletMoney);
                    $("#zone").combobox('setValue', result[0].zone);
                    $("#orderAddress").val(result[0].orderAddress);
                    $("#orderAddress").attr("readonly", "readonly");
                    $("#orderTime").datebox('setValue', result[0].orderTime);
                    $("#submitTime").datebox('setValue', result[0].submitTime);
                    $("#orderLongitude").val(result[0].orderLongitude);
                    $("#orderLatitude").val(result[0].orderLatitude);
                    if (result[0].orderStatus == '0') {
                        $("#orderStatus").combobox('setValue', '新增');
                    } else if (result[0].orderStatus == '01') {
                        $("#orderStatus").combobox('setValue', '待分配');
                    } else if (result[0].orderStatus == '02') {
                        $("#orderStatus").combobox('setValue', '已分配');
                    }
                    if (result[0].defrayType == '01') {
                        $("#defrayType").combobox('setValue', '在线支付');
                    } else if (result[0].defrayType == '02') {
                        $("#defrayType").combobox('setValue', '货到支付');
                    }

                    if (result[0].defrayStatus == '01') {
                        $("#defrayStatus").combobox('setValue', '已支付');
                    } else if (result[0].defrayStatus == '02') {
                        $("#defrayStatus").combobox('setValue', '未支付');
                    }

                    if (result[0].orderType == '01') {
                        $("#orderType").combobox('setValue', '微信');
                    } else if (result[0].orderType == '02') {
                        $("#orderType").combobox('setValue', '电话');
                    }
                    if (result[0].appTimeId == '0' || result[0].appTimeId == null) {
                        $("#appTimeId").combobox('setValue', '及时送达');
                    } else if (result[0].appTimeId == '1') {
                        $("#appTimeId").combobox('setValue', '16:00~16:30');
                    } else if (result[0].appTimeId == '2') {
                        $("#appTimeId").combobox('setValue', '16:30~17:00');
                    } else if (result[0].appTimeId == '3') {
                        $("#appTimeId").combobox('setValue', '17:00~17:30');
                    } else if (result[0].appTimeId == '4') {
                        $("#appTimeId").combobox('setValue', '17:30~18:00');
                    } else if (result[0].appTimeId == '5') {
                        $("#appTimeId").combobox('setValue', '18:00~18:30');
                    } else if (result[0].appTimeId == '6') {
                        $("#appTimeId").combobox('setValue', '18:30~19:00');
                    } else if (result[0].appTimeId == '7') {
                        $("#appTimeId").combobox('setValue', '19:00~19:30');
                    } else if (result[0].appTimeId == '8') {
                        $("#appTimeId").combobox('setValue', '19:30~20:00');
                    } else if (result[0].appTimeId == '9') {
                        $("#appTimeId").combobox('setValue', '20:00~20:30');
                    } else if (result[0].appTimeId == '10') {
                        $("#appTimeId").combobox('setValue', '20:30~21:00');
                    } else if (result[0].appTimeId == '11') {
                        $("#appTimeId").combobox('setValue', '21:00~21:30');
                    } else if (result[0].appTimeId == '12') {
                        $("#appTimeId").combobox('setValue', '21:30~22:00');
                    } else if (result[0].appTimeId == '13') {
                        $("#appTimeId").combobox('setValue', '22:00~22:30');
                    } else if (result[0].appTimeId == '14') {
                        $("#appTimeId").combobox('setValue', '22:30~23:00');
                    } else if (result[0].appTimeId == '15') {
                        $("#appTimeId").combobox('setValue', '23:00~23:30');
                    } else if (result[0].appTimeId == '16') {
                        $("#appTimeId").combobox('setValue', '23:30~24:00');
                    }


                    $("#remark").val(result[0].remark);
                    $("#remark").attr("readonly", "readonly");
                    $("#shipName").combobox('setValue', result[0].shipName);
                    $('#orderStatus').combobox('disable');
                    orderDetail.addPopu('2', id, orderType);
                }
            }, 'json');
        },
        //新增商品记录
        append1: function () {
            alert(444)
            if (editIndex != undefined) {
                details_mmg.datagrid("endEdit", editIndex);
            }
            //添加时如果没有正在编辑的行，则在datagrid的第一行插入一行
            if (editIndex == undefined) {
                details_mmg.datagrid("insertRow", {
                    index: 0, // index start with 0
                    row: {}
                });
                //将新插入的那一行开户编辑状态
                details_mmg.datagrid("beginEdit", 0);
                //给当前编辑的行赋值
                editIndex = 0;
            }
        },
        //新增商品记录
        append: function () {
            details_mmg.datagrid('endEdit', editIndex);
            $('#details_dg').datagrid('appendRow', {status: 'P'});
            editIndex = $('#details_dg').datagrid('getRows').length - 1;
            $('#details_dg').datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);

        },
        //计算删除数据后的总金额
        delMoney: function () {
            var rows = details_mmg.datagrid("getSelections");
            var count = 0;
            var price = 0.00;
            var delprice = 0.00;
            var allprice = $("#orderMoney").val();
            var nowprice = 0.00;
            count = rows[0]['articleCount'];       //获取选中行数量
            price = rows[0]['articleMoney'];       //获取选中行商品单价
            delprice = parseInt(count) * parseInt(price);
            nowprice = parseInt(allprice) - parseInt(delprice);
            $("#orderMoney").val(nowprice);
            var editItem = $("#orderPopu").serialize();
            var items = details_mmg.datagrid('getData');
            $.ajax({
                type: 'POST',
                url: '/editOrders?' + editItem,
                dataType: 'json',
                data: {details: JSON.stringify(items.rows)},
                success: function (result) {
                    if (result == '1') {
                        return;
                    } else {

                    }
                }
            })

        },
        //删除商品记录
        removeit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var orderId;
            $.each(chackedItem, function (index, item) {
                orderId = item.id;
            });

            var ids = [];
            var rows = details_mmg.datagrid("getSelections");
            var data = $('#details_dg').datagrid('getData');


            //选择要删除的行
            if (rows.length > 0) {
                $.messager.confirm("提示", "你确定要删除这行吗?", function (r) {
                    if (r) {

                        for (var i = 0; i < rows.length; i++) {
                            ids.push(rows[i].id);

                        }
                        //将选择到的行存入数组并用,分隔转换成字符串

                        if (ids == undefined || ids == '' || ids == null || orderId == undefined) {

                            if (editIndex == undefined) {
                                return
                            }
                            $('#details_dg').datagrid('cancelEdit', editIndex)
                                .datagrid('deleteRow', editIndex);
                            editIndex = undefined;

                            var rows1 = $('#details_dg').datagrid("getRows");
                            //var rowIndex=$('#details_dg').datagrid('getRowIndex',$('#details_dg').datagrid('getSelected'))
                            //alert(rowIndex)
                            var count1 = 0;
                            var price1 = 0.00;
                            var allprice1 = $("#orderMoney").val();
                            var nowprice1 = 0.00;
                            for (var i = 0; i < rows1.length; i++) {
                                nowprice1 += parseInt(rows1[i]['articleCount']) * parseInt(rows1[i]['articleMoney']);
                            }

                            $("#orderMoney").val(nowprice1);

                        } else {
                            $.ajax({
                                type: 'POST',
                                url: '/delOrderDetails',
                                data: 'id=' + ids.join(','),
                                success: function (result) {
                                    if (result == '1') {
                                        alert('删除成功！');
                                        orderDetail.delMoney();
                                        $('#details_dg').datagrid('reload');
                                        if (data.total < 2) {
                                            $.ajax({
                                                type: 'POST',
                                                url: '/delOrderById',
                                                data: 'id=' + orderId,
                                                success: function (result) {
                                                    if (result == '1') {
                                                        orderDetail.load();
                                                        orderDetail.closePopu();
                                                    } else {
                                                    }
                                                }
                                            })
                                        }

                                        return;
                                    } else {
                                        alert('删除失败！');
                                        orderDetail.load();
                                        orderDetail.closePopu();
                                        return;
                                    }
                                }
                            });


                        }
                    } else {
                        orderDetail.load();
                    }
                });
            }
            else {
                $.messager.alert("提示", "请选择要删除的行", "error");
            }

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
            orderDetail.getProductName(null);
            /*orderDetail.formatProductName();*/
            /*/var rows = details_mmg.datagrid("getSelections");
             //如果只选择了一行则可以进行修改，否则不操作
             if (rows.length == 1) {
             //修改之前先关闭已经开启的编辑行，当调用endEdit该方法时会触发onAfterEdit事件
             if (editIndex != undefined) {
             details_mmg.datagrid("endEdit", editIndex);
             }
             //当无编辑行时
             if (editIndex == undefined) {
             alert(editIndex)
             //获取到当前选择行的下标
             var index = details_mmg.datagrid("getRowIndex", rows[0]);
             alert(index)
             //开启编辑
             details_mmg.datagrid("beginEdit", index);
             //把当前开启编辑的行赋值给全局变量editRow
             editIndex = index;
             //当开启了当前选择行的编辑状态之后，

             }
             }*/
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
        closePopu: function (val, unload) {
            orderDetail.clearForm(val, unload);
            $('#w').window('close', true);

        },
        //查询
        load: function () {
            var orderno = $("#orderno").val();
            var tel = $("#tel").val();
            var orderstatus = $("#orderstatus").combobox('getValue');
            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');


            $('#dg').datagrid('load', {
                orderno: orderno,
                tel: tel,
                orderstatus: orderstatus,
                firsttime: firsttime,
                lasttime: lasttime

            });
        },


        //保存
        save: function () {
            var id = $("#id").val();
            var data = $('#details_dg').datagrid('getData');

            var clientName = $("#clientName").val();
            var clientTel = $("#clientTel").val();
            var orderAddress = $("#orderAddress").val();
            var items = details_mmg.datagrid('getData');
            if (id == "" || id == undefined || id == null) {


                if (clientName == undefined || clientName == '' || clientName == null) {
                    alert('请填写姓名');
                    return;
                }
                if (clientTel == undefined || clientTel == '' || clientTel == null) {
                    alert('请填写联系电话');
                    return;
                }
                if (orderAddress == undefined || orderAddress == '' || orderAddress == null) {
                    alert('请填写地址');
                    return;
                }

                if (items.rows == 0) {
                    alert('尚未选购商品！');
                    return;
                }
                $("#save").attr("data-options", "iconCls:'icon-ok',disabled:true");
                $("#save").attr("class", "easyui-linkbutton l-btn l-btn-disabled");
                var orderItem = $("#orderPopu").serialize();
                $.ajax({
                    type: 'POST',
                    url: '/addOrders?' + orderItem,
                    dataType: 'json',
                    data: {details: JSON.stringify(items.rows)},
                    success: function (result) {
                        if (result == '1') {
                            alert('下单成功！');
                            $('#orderPopu').form('clear');
                            orderDetail.load();
                            orderDetail.closePopu();
                            return;
                        } else {
                            alert('下单失败！');
                            orderDetail.closePopu();
                            $("#save").attr("data-options", "iconCls:'icon-ok'");
                            $("#save").attr("class", "easyui-linkbutton l-btn");
                            return;
                        }
                    }
                })
            }
            else {

                if (clientName == undefined || clientName == '' || clientName == null) {
                    alert('请填写姓名');
                    return;
                }
                if (clientTel == undefined || clientTel == '' || clientTel == null) {
                    alert('请填写联系电话');
                    return;
                }
                if (orderAddress == undefined || orderAddress == '' || orderAddress == null) {
                    alert('请填写地址');
                    return;
                }

                if (items.rows == 0) {
                    alert('尚未选购商品！');
                    return;
                }
                var editItem = $("#orderPopu").serialize();

                //alert(data.total)
                //alert(data.rows.length)
                $.ajax({
                    type: 'POST',
                    url: '/editOrders?' + editItem,
                    dataType: 'json',
                    data: {details: JSON.stringify(items.rows)},
                    success: function (result) {
                        if (result == '1') {
                            alert('修改成功！');
                            orderDetail.load();
                            orderDetail.clearForm('orderPopu');
                            orderDetail.closePopu();
                            return;
                            /*   window.location.reload();*/
                            return;

                        } else {
                            alert('修改失败！');
                            orderDetail.closePopu();
                            $("#save").attr("data-options", "iconCls:'icon-ok'");
                            $("#save").attr("class", "easyui-linkbutton l-btn");
                            return;
                        }
                    }
                })


            }

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
                                    $('#orderPopu').form('clear');
                                    orderDetail.load();
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
                                    orderDetail.load();
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
                        orderDetail.load();
                        return;
                    } else {
                        alert('删除失败！');
                        return;
                    }
                }
            })
        },

        //清空表单
        clearForm: function (formID, unload) {

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
            if (unload == "" || unload == null || unload == undefined) {


                $('#dg').datagrid('load', {});
            }
        }
    }
}()

