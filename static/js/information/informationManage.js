$(document).ready(function() {
	/*informationManage.init();*/
    informationManage.getShowFlag();
    /*informationManage.kindeditor();*/
});




var _mmg = null;

var informationManage = function(){
    return{

        init: function(){

              if ($("#msg1").val() == '1') {

                alert('提交成功！');

                 _mmg=$('#dg').datagrid({
                    url:'/informationPage',
                    params: $("#informationInputForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    pagination:true,
                    pageSize: 25,
                    pageList: [20,25,30],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden:true},
                            {
                             field: 'newSlabel',
                             title: '资讯标签',
                             width: 180,
                             type: 'String',
                            formatter: function (val, item, rowIndex) {
                            var s='<span><a href="#" onclick="informationManage.detail(\''+ item.id +'\')">'+val+'</a></span>'
                            return s;
                     }
                         },

                            {field:'title', title:'资讯标题', width:250},
                            {field:'createTime', title:'创建时间', width:120},
                            {
                            field: 'isShow',
                            title: '是否显示',
                            width: 120,
                            type: 'String',
                            formatter: function (val) {
                                if (val == '')
                                    return '';
                                else if (val == '0')
                                    return '不显示';
                                else if (val == '1')
                                    return '<span style="color:red;">显示</span>';

                            }
                            }

                        ]
                    ]
                }).datagrid("clientPaging");

                return;

            }
            if ($("#msg1").val() == '2') {

                alert('提交失败！');
                informationManage.closePopu();
                return;
            }
             if ($("#msg1").val() == "" || $("#msg1").val() == null || $("#msg1").val() == undefined) {

                 _mmg = $('#dg').datagrid({
                     url: '/informationPage',
                     params: $("#informationInputForm").serialize(),
                     method: 'post',
                     rownumbers: true,
                     pagination: true,
                     pageSize: 25,
                     pageList: [20, 25, 30],
                     columns: [
                         [
                             {field: 'ck', checkbox: true},
                             {field: 'id', title: 'id', hidden: true},

                             {
                             field: 'newSlabel',
                             title: '资讯标签',
                             width: 180,
                             type: 'String',
                            formatter: function (val, item, rowIndex) {
                            var s='<span><a href="#" onclick="informationManage.detail(\''+ item.id +'\')">'+val+'</a></span>'
                            return s;
                             }
                             },
                             {field: 'title', title: '资讯标题', width: 250},
                             {field: 'createTime', title: '创建时间', width: 120},
                             {
                                 field: 'isShow',
                                 title: '是否显示',
                                 width: 120,
                                 type: 'String',
                                 formatter: function (val) {
                                     if (val == '')
                                         return '';
                                     else if (val == '0')
                                         return '不显示';
                                     else if (val == '1')
                                         return '<span style="color:red;">显示</span>';

                                 }
                             }


                         ]
                     ]
                 }).datagrid("clientPaging");
             }
        },

       //新增_弹出框
        addPopu: function () {
            $('#w').window('open');
        },

        //查询
        load: function(){
           var title=$("#title").val();
           var is_show = $("#is_show").combobox('getValue');
           $('#dg').datagrid('load',{
                title: title,
                is_show: is_show,


            });
        },

        //查询
        getShowFlag: function(){
           $('#isShow').combobox({
            onChange: function (n, o) {
        if(n=='1'){
            $("#showPosition").show();
        }
        if(n=='0'){
            $("#showPosition").hide();
        }
            }
        });

        },
        //关闭弹出框
        closePopu: function () {

            $('#w').window('close');
        },

        //删除功能
       del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');

            var information_ids = [];
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
                        var information_id;
                        $.each(chackedItem1, function (index, item) {

                            information_id = item.id;


                        });
                        $.ajax({
                            type: 'POST',
                            url: '/delInformation_by_id',
                            data: 'id=' + information_id,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    informationManage.load();
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
                            if (information_ids == "") {
                                information_ids = "" + item.id + "";
                            } else {
                                information_ids = "" + item.id + "" + "," + information_ids;
                                ids = information_ids.split(',');
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/delInformation_by_ids',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    informationManage.load();
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

        //修改内容
        edit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var information_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                information_id = item.id;

            });
            $.post('/select_information_by_id', {id: information_id}, function (result) {
                  console.info(result[0])
                if (result != null) {

                    $("#id").val(result[0].id);
                    $("#newSlabel").val(result[0].newSlabel);
                    $("#title1").val(result[0].title1);
                    $("#isShow").combobox('setValue', result[0].isShow);
                    $("#showSort").combobox('setValue', result[0].showSort);
                    $("#imghead").attr("src", result[0].newsimgUrl)
                    $(document.getElementsByTagName('iframe')[0].contentWindow.document.body).html(result[0].content);

                }
            }, 'json');
            informationManage.addPopu();
        },

        //订单详情
        detail: function (id) {
             /*
             var chackedItem = $('#dg').datagrid('getChecked');
            var information_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                information_id = item.id;

            });*/
            $.post('select_information_by_id', {id: id}, function (result) {
                if (result != null) {
                    $("#id").val(result[0].id);
                    $("#newSlabel").val(result[0].newSlabel);
                    $("#title1").val(result[0].title1);
                    $("#isShow").combobox('setValue', result[0].isShow);
                    $("#showSort").combobox('setValue', result[0].showSort);
                    $("#imghead").attr("src", result[0].newsimgUrl)
                    $(document.getElementsByTagName('iframe')[0].contentWindow.document.body).html(result[0].content);
                    informationManage.addPopu();
                }
            }, 'json');
        },
       //清空表单
        clearForm: function(formID,unload){

           $("#" + formID).each(function () {
               $("#title").val('')
               $('#is_show').combobox('clear');

            // iterate the elements within the form
            $(':input', this).each(function () {
                var type = this.type, tag = this.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file")
                    this.value = '';
                else if (type == 'checkbox' || type == 'radio')
                    this.checked = false;
                else if (tag == 'select')
                   $('#is_show').combobox('clear');

            });
        });

                $('#dg').datagrid('load', {});


       },
        //编辑器初始化
        kindeditor: function (K) {
            var editor;
            KindEditor.ready(function (K) {

                editor = K.create('#easyui_ditor');
                var options = {
                    cssPath: 'static/css/index.css',
                    filterMode: true
                };

                // 同步数据后可以直接取得textarea的value
                editor.sync();


                // 设置HTML内容#}
                /* editor.html('HTML内容');*/
                html = editor.html();
                var xx = $("#easyui_ditor").html()


            });

        },

    }

}

();
