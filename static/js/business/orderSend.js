$(document).ready(function () {
    orderSend.init();
});

var _mmg = null;
var orderSend = function () {
    return {
        init: function () {
            _mmg = $('#dg').datagrid({
                url: '/sendPage',
                params: $("#OrderInputForm").serialize(),
                method: 'post',
                rownumbers: true,
                pagination: true,
                pageSize: 15,
                pageList: [10, 15, 20],
                columns: [
                    [
                        {field: 'ck', checkbox: true},
                        {field: 'id', title: 'id', hidden: true},
                        {field: 'orderno', title: '订单编号', width: 160},
                        {field: 'deliveryName', title: '配送员', width: 100},
                        {field: 'deliveryTel', title: '配送员电话', width: 100},
                        {field: 'clientName', title: '下单人姓名', width: 100},
                        {field: 'clientTel', title: '下单人电话', width: 100},
                        {field: 'clientAddr', title: '订单地址', width: 100},
                        {field: 'sendTime', title: '配送时间', width: 120},
                        {field: 'endTime', title: '配送完成时间', width: 120},
                        {
                            field: 'sendStatus', title: '配送状态', width: 100, formatter: function (val) {
                            if (val == '')
                                return '';
                            else if (val == '01')
                                return '未发送';
                            else if (val == '02')
                                return '在途';
                            else if (val == '03')
                                return '签收'
                        }
                        }
                    ]
                ]
            }).datagrid("clientPaging");
            ;
        },

        //查询
        load: function () {
            var orderno = $("#orderno").val();
            var tel = $("#tel").val();
            var state = $("#state").combobox('getValue');

            $('#dg').datagrid('load', {
                orderno: orderno,
                tel: tel,
                state: state
            });
        },
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
                        var DetailId;
                        $.each(chackedItem1, function (index, item) {
                            DetailId = item.id;

                        });

                        $.ajax({
                            type: 'POST',
                            url: '/delOrderSendById',
                            data: 'id=' + DetailId,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    orderSend.load();
                                    return;
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
                            url: '/delOrderSend',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    orderSend.load();
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
        }

    }
}()