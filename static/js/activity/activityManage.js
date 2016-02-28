$(document).ready(function() {
	activityManage.init();
});

var _mmg = null;
var details_mmg = null;
var editIndex = undefined;
var activity_id;
var activityManage = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/activityPage',
                    params: $("#activityForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    pagination:true,
                    pageSize: 15,
                    pageList: [10,15,20],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden:true},
                            {field:'vouchersName', title:'活动名称', width:200,
                                /* formatter: function (val, item, rowIndex) {
                                 var s = '<span><a href="#" onclick="activityManage.detail(\'' + item.id + '\')">' + val + '</a></span>'
                                 return s;
                                 }*/
                            },
                            {
                            field: 'useType',
                            title: '使用类型',
                            width: 120,
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
                         /*   {
                            field: 'vouchersType',
                            title: '活动类型',
                            width: 100,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '01')
                                    return '红包';
                                else if (val == '02')
                                    return '代金券';

                            }
                            },*/
                            {field:'createTime', title:'活动创建时间', width:120},
                            /*{field:'effectivenessTime', title:'活动到期时间', width:120},*/
                            {field:'remark', title:'备注', width:200},
                            {
                             field: 'activityIsEffect',
                             title: '活动是否有效',
                             width: 100,
                             type: 'String',
                             formatter: function (val, item, rowIndex) {


                                    /*   if (val == '')
                                     return '';
                                     else if (val == '0')
                                     return '<span><a href="#" onclick="activityManage.yes_no(\''+ item.id +'\')">有效</a></span>';
                                     else if (val == '1')
                                     return '<span><a href="#" onclick="activityManage.yes_no(\''+ item.id +'\')"><span style="color:red;">已失效</span></a></span>';*/
                                    var s1 = '';
                                    if (val == '')
                                        s1 = s1;
                                    else if (val == '0')
                                        s1 = '有效';
                                    else if (val == '1')
                                        s1 = '<span style="color:red;">已失效</span>';
                                    var s='<span><a href="#" onclick="activityManage.yes_no(\''+ item.id +'\',\''+ val +'\')">'+ s1+'</a></span>'

                                    return s;


                             }
                             },

                        ]
                    ]
                }).datagrid("clientPaging");
        },

        //查询
        load: function(){
            var vouchersName=$("#vouchersName").val();
            var useType =  $("#useType").combobox('getValue');
           $('#dg').datagrid('load',{
                vouchersName: vouchersName,
                useType: useType,

            });
        },

        //详情列表初始化
        detailsPupo: function (id) {

            //清空列表结果集
            $('#details_dg').datagrid('loadData', {total: 0, rows: []});
            //列表初始化
            details_mmg = $('#details_dg').datagrid({
                    url: '/activity/samll_detail',
                    queryParams: {'id': activity_id},
                    reload: true,
                    method: 'post',
                    dataType: 'json',
                    singleSelect: true,
                    toolbar: '#tb',
                    onClickRow: 'onClickRow',
                    idField: 'id', //主键
                    columns: [
                        [

                            {field: 'money', title: '金额', width: 450, editor: 'numberbox'},

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

        //新增代金券金额
        append: function () {
            details_mmg.datagrid('endEdit', editIndex);
           /*    $('#details_dg').datagrid('appendRow', {status: 'P'});*/
            $('#details_dg').datagrid('appendRow', {activityDetailId:''});
            editIndex = $('#details_dg').datagrid('getRows').length - 1;
            $('#details_dg').datagrid('selectRow', editIndex).datagrid('beginEdit', editIndex);

        },

        //删除小表格数据
        removeit: function () {
            var chackedItem = $('#details_dg').datagrid('getChecked');
            var activatyDtl_id;
            $.each(chackedItem, function (index, item) {
                activatyDtl_id = item.activityDetailId;
               console.info(item)
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

                        if ( activatyDtl_id == '' || activatyDtl_id == null || activatyDtl_id == undefined) {

                            if (editIndex == undefined) {
                                return
                            }
                            $('#details_dg').datagrid('cancelEdit', editIndex)
                                .datagrid('deleteRow', editIndex);
                            editIndex = undefined;
                        } else {
                            $.ajax({
                                type: 'POST',
                                url: '/delActivatyDetail_by_id',
                                data: 'id=' + activatyDtl_id,
                                success: function (result) {
                                    if (result == '1') {
                                        alert('删除成功！');
                                        $('#details_dg').datagrid('reload');
                                        return;
                                    } else {
                                        alert('删除失败！');
                                        activityManage.load();
                                        activityManage.closePopu();
                                        return;
                                    }
                                }
                            });


                        }
                    } else {
                        activityManage.load();
                    }
                });
            }
            else {
                $.messager.alert("提示", "请选择要删除的行", "error");
            }

        },
         //保存商品记录
        accept: function () {
            details_mmg.datagrid('endEdit', editIndex);
            $('#details_dg').datagrid('acceptChanges');

        },
        //编辑商品
        endEditing: function () {
            //开启编辑
            details_mmg.datagrid("beginEdit", editIndex);

        },

        //新增_弹出框
        addPopu: function (id) {
            activityManage.detailsPupo()

            $('#w').window('open');
        },
        //关闭弹出框
        closePopu: function () {
             $('#activityPopu').form('clear');

             //清空小列表结果集
             $('#details_dg').datagrid('loadData', {total: 0, rows: []});

             $('#w').window('close');
        },

         //删除功能
       del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');

            var activity_ids = [];
            var ids;
            if (chackedItem.length == '0') {
                alert("请至少选择一条记录！");
                return;
            }
            $.messager.confirm('确认', '您确定要删除当前选中的' + chackedItem.length + '条记录吗？', function (r) {
                if (r) {
                    if (chackedItem.length == 1) {
                        //删除单条记录
                        var chackedItem1 = $('#dg').datagrid('getChecked');
                        var activity_id;
                        $.each(chackedItem1, function (index, item) {

                            activity_id = item.id;


                        });
                        $.ajax({
                            type: 'POST',
                            url: '/delActivity_by_id',
                            data: 'id=' + activity_id,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    activityManage.load();
                                    return;
                                } else {
                                    alert('删除失败！');
                                    return;

                                }
                            }
                        })
                    } else {
                        //删除多条记录
                        $.each(chackedItem, function (index, item) {
                            if (activity_ids == "") {
                                activity_ids = "" + item.id + "";
                            } else {
                                activity_ids = "" + item.id + "" + "," + activity_ids;
                                ids = activity_ids.split(',');
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/delActivity_by_ids',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    activityManage.load();
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

        //活动是否有效
        yes_no: function (activity_id,activity_isEffect) {

              $.messager.confirm('确认', '您确定要进行此操作吗？', function (r) {
                if (r) {
                    $.ajax({
                    type: 'POST',
                    /*  url: '/activaty_yes_no?activity_id=' + activity_id +'&activity_isEffect='+activity_isEffect,*/
                    url: '/activity_yes_no',
                    dataType: 'json',
                    data:{activity_id:activity_id,activity_isEffect:activity_isEffect},
                    success: function (result) {
                        if (result == '1') {
                            alert('操作成功！');
                            $('#activityPopu').form('clear');
                            activityManage.load();
                            activityManage.closePopu();
                            return;
                        } else {
                            alert('操作失败！');
                            activityManage.closePopu();
                            return;
                        }
                    }
                })
                }
            });


        },

        //保存
        save: function () {
            var params = $("#activityPopu").serialize();
            var id = $("#id").val();
            var vouchersName2 = $("#vouchersName2").val();
            var effectiveDay1 = $("#effectiveDay1").val();

            var item = $('#details_dg').datagrid('getData');
            var items = details_mmg.datagrid('getData');
            if (id == "" || id == undefined || id == null) {
                  if(/^\d+$/.test(effectiveDay1))
                    {
                         if (vouchersName2 == undefined || vouchersName2 == '' || vouchersName2 == null) {
                    alert('请填写活动名称');
                      $("#vouchersName2").focus();
                      $(":text").focus(function () {
                      this.select();
                         });

                    return;
                };

                  if (items.rows == 0) {
                    alert('请填写代金券信息');
                    return;
                }

                 $.ajax({
                    type: 'POST',
                    url: '/add_activaty?' + params,
                    dataType: 'json',
                    data: {details: JSON.stringify(item.rows)},
                    success: function (result) {
                        if (result == '1') {
                            alert('添加活动成功！');
                            $('#activityPopu').form('clear');
                            activityManage.clearForm('activityPopu');
                               //清空列表结果集
                            $('#details_dg').datagrid('loadData', {total: 0, rows: []});
                            activityManage.load();
                            activityManage.closePopu();
                            return;
                        } else {
                            alert('添加活动失败！');
                            activityManage.closePopu();
                            return;
                        }
                    }
                })
                    }else{

                      alert("活动天数必须为正整数")
                      $("#effectiveDay1").focus();
                      $(":text").focus(function () {
                       this.select();
                         });
                  }

            }
            else {
                if (vouchersName2 == undefined || vouchersName2 == '' || vouchersName2 == null) {
                    alert('请填写活动名称');
                    return;
                }
                $.ajax({
                    type: 'POST',
                    url: '/edit_activaty?' + params,
                    dataType: 'json',
                    data: {details: JSON.stringify(item.rows)},
                    success: function (result) {
                        if (result == '1') {
                            alert('修改活动成功');
                            $('#activityPopu').form('clear');
                            activityManage.clearForm('activityPopu');
                               //清空列表结果集
                            $('#details_dg').datagrid('loadData', {total: 0, rows: []});
                            activityManage.load();
                            activityManage.closePopu();
                            return;

                            return;

                        } else {
                            alert('修改活动失败');
                            activityManage.closePopu();

                            return;
                        }
                    }
                })


            }


        },



         //查看订单详情
        editPopu: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                activity_id = item.id;
            });
            $.post('/activity/big_detail', {id: activity_id}, function (result) {


                if (result != null) {
                    $("#id").val(result[0].activityId);
                    $("#vouchersName2").val(result[0].vouchersName1);
                    $("#effectiveDay1").val(result[0].effectiveDay);
                    $("#effectiveDay1").attr("readonly", "readonly");
                    if (result[0].vouchersType == '01') {
                        $("#vouchersType1").combobox('setValue', '红包');
                    } else if (result[0].vouchersType == '02') {
                        $("#vouchersType1").combobox('setValue', '代金卷');
                    }
                    if (result[0].useType1 == '01') {
                        $("#useType1").combobox('setValue', '活动发放');
                    } else if (result[0].useType1 == '02') {
                        $("#useType1").combobox('setValue', '购买后发放');
                    }
                    $("#remark").val(result[0].remark);
                    activityManage.detailsPupo();

                }
            }, 'json');
            $('#w').window('open');

        },

        //订单详情
        detail: function (id) {
            var chackedItem = $('#dg').datagrid('getChecked');

            $.each(chackedItem, function (index, item) {
                activity_id = item.id;
            });
            $.post('/activity/big_detail', {id: activity_id}, function (result) {


                if (result != null) {
                    $("#id").val(result[0].activityId);
                    $("#vouchersName2").val(result[0].vouchersName1);
                    $("#effectiveDay1").val(result[0].effectiveDay);
                    $("#effectiveDay1").attr("readonly", "readonly");
                    if (result[0].vouchersType == '01') {
                        $("#vouchersType1").combobox('setValue', '红包');
                    } else if (result[0].vouchersType == '02') {
                        $("#vouchersType1").combobox('setValue', '代金卷');
                    }
                    $("#remark").val(result[0].remark);
                    activityManage.detailsPupo();

                }
            }, 'json');
            $('#w').window('open');
        },
        //导出excel
    savaExcel: function () {

           var sava_Excel=$("#sava_Excel").val();

           var clientname=$("#clientname").val();
           var clienttel = $("#clienttel").val();

           var pramas={"clientname":clientname,"clienttel":clienttel}
             $.messager.confirm('', '您确定要导出EXCEL吗', function (r) {
                if (r) {
           $.ajax({
               type:'POST',
               url:'/excelPage1?key=key',
               data:pramas,
               success:function(result){
                   if(result=='1'){
                       window.location.href=sava_Excel;
                   }else{
                        alert("导出失败！");
                        walletDetails.load();
                   }
               }
           });
          }
        });

        },

       //清空表单
        clearForm: function(formID){
           $("#" + formID).each(function () {

            // iterate the elements within the form
               $("#vouchersName").val('')
               $('#useType').combobox('clear');

            $(':input', this).each(function () {
                var type = this.type, tag = this.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file")
                    this.value = '';
                else if (type == 'checkbox' || type == 'radio')
                    this.checked = false;
                else if (tag == 'select')
                     $('#useType').combobox('clear');

            });
        });
             $('#dg').datagrid('load', {});
       }

    }

}



();
