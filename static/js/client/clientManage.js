var _mmg = null;
var clientManage = function () {
    return {
        //客户明细列表显示
        init: function () {
            _mmg = $('#dg').datagrid({
                url: '/clientPage',
                params: $("#clientInputForm").serialize(),
                method: 'post',
                pagination: true,
                pageSize: 15,
                pageList: [10, 15, 20],
                columns: [
                    [
                        {field: 'ck', checkbox: true},
                        {field: 'id', title: 'id', hidden: true},
                        {field:'clientTel', title:'电话', width:100,
                                 formatter: function (val, item, rowIndex) {
                                 var s = '<span><a href="#" onclick="clientManage.detail(\'' + item.id + '\')">' + val + '</a></span>'
                                 return s;
                                 }
                            },

                        {field: 'clientName', title: '客户姓名', width: 80},
                        {field: 'clientTime', title: '注册时间', width: 200},
                        {
                             field: 'activitySend',
                             title: '活动发放',
                             width: 100,
                             type: 'String',
                             formatter: function (val, item, rowIndex) {

                                    var s='<span><a href="#" onclick="clientManage.activitySend(\''+ item.id +'\')">活动发放</a></span>'

                                    return s;


                             }
                             },

                    ]
                ]
            }).datagrid("clientPaging");
        },

         //活动发放
        activitySend: function (id) {
         clientManage.detailsPupo();
         $('#w').window('open');

        },

        detail: function (id) {

            clientManage.walletPupo(id);
            $('#s').window('open');

        },
        //活动详情列表初始化
        detailsPupo: function () {
            //清空列表结果集
            $('#details_dg').datagrid('loadData', {total: 0, rows: []});
            //列表初始化
            details_mmg = $('#details_dg').datagrid({
                    url: '/get_allActivity',
                    reload: true,
                    method: 'post',
                    dataType: 'json',
                    singleSelect: true,
                    onClickRow: 'onClickRow',
                    idField: 'id', //主键
                    columns: [
                        [

                            {field: 'vochersName', title: '活动名称', width: 130},
                            {
                            field: 'vouchersType',
                            title: '活动类型',
                            width: 70,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '01')
                                    return '红包';
                                else if (val == '02')
                                    return '代金券';

                            }
                            },
                             {field: 'count', title: '发放张数/张', width: 80},
                             {field: 'allMoney', title: '总额/元', width: 80},
                             {field: 'effectiveDay', title: '有效天数/天', width: 80},

                        ]
                    ],

                }
            )

        },
        //代金卷列表初始化
        walletPupo: function (id) {
                $('#wallet_dg').datagrid('loadData', {total: 0, rows: []});
                //列表初始化
                $('#wallet_dg').datagrid({
                    url: '/get_allWallet',
                    reload: true,
                    method: 'post',
                    singleSelect: true,
                    onClickRow: 'onClickRow',
                    idField: 'id', //主键
                    queryParams: {'id': id},
                    columns: [
                        [
                            {field: 'walletMoney', title: '金额/元', width: 85},
                            {
                            field: 'walletType',
                            title: '优惠类型',
                            width: 75,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '01')
                                    return '红包';
                                else if (val == '02')
                                    return '代金券';

                            }
                            },
                            {
                            field: 'useStatus',
                            title: '使用情况',
                            width: 75,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '01')
                                    return '已使用';
                                else if (val == '02')
                                    return '未使用';
                                else if (val == '03')
                                    return '已过期';

                            }
                            },
                            {
                            field: 'useType',
                            title: '使用类型',
                            width: 75,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '01')
                                    return '活动发放';
                                else if (val == '02')
                                    return '购买后发放';


                            }
                            },
                             {field: 'effectivenessTime', title: '失效时间', width: 120},

                        ]
                    ],

                }
            )

        },
         //新增_弹出框
        save: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var client_Id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                //获得客户ID
                client_Id = item.id;
            });
            var chackedItem1 = $('#details_dg').datagrid('getChecked');
            var activity_Id;
            var effective_Day;
            var use_Type;
            $.each(chackedItem1, function (index, item) {
                //获得活动ID

                activity_Id = item.id;
                effective_Day=item['effectiveDay'];
                use_Type=item['useType1'];
                //console.info(item)


            });
             $.messager.confirm('确认', '您确定要给这个客户发放此活动吗？', function (r) {
                if (r) {
                    $.ajax({
                    type: 'POST',
                    url: '/send_Activity',
                    dataType: 'json',
                    data:{client_Id:client_Id,activity_Id:activity_Id,effective_Day:effective_Day,use_Type:use_Type},
                    success: function (result) {
                        if (result == '1') {
                            alert('发放成功！');
                            $('#clientInputForm').form('clear');
                            clientManage.load();
                            clientManage.closePopu();
                            return;
                        } else {
                            alert('发放失败！');
                            clientManage.closePopu();
                            return;
                        }
                    }
                })
                }
            });


        },


        //关闭活动弹出框
        closePopu: function () {
             $('#activityPopu').form('clear');

             //清空小列表结果集
             $('#details_dg').datagrid('loadData', {total: 0, rows: []});

             $('#w').window('close');
        },

        //关闭活动弹出框
        closewalletPopu: function () {
             $('#walletform').form('clear');
             //清空小列表结果集s
             $('#s').window('close');
        },
        //查询
        load: function () {
            var clientName = $("#clientName").val();
            var clientTel = $("#clientTel").val();
            $('#dg').datagrid('load', {
                clientName: clientName,
                clientTel: clientTel
            });
        },
        //删除客户信息
        del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var clientId;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                clientId = item.id;

            });

            $.ajax({
                type: 'POST',
                url: '/delClient',
                data: 'id=' + clientId,
                success: function (result) {
                    if (result == '1') {
                        alert('删除成功！');
                        clientManage.clearForm('clientInputForm')
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
    }
}()
