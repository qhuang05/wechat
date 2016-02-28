$(document).ready(function() {
	DHDataQuery.init();

});



var _mmg = null;
var details_mmg = null;
var DHDataQuery = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({

                    url:'/DHDataQueryPage',
                    params: $("#DHDataForm").serialize(),
                    rownumbers: true,
                    pagination:true,
                    fitColumns : true,
                    showFooter:true,
                    pageSize: 15,
                    pageList: [10,15,20],
                    idField: 'clientTel', //主键
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field: 'cilentId', title: 'cilentId', hidden: true},
                               {
                            field: 'clientTel',
                            title: '联系电话',
                            width: 150,
                            type: 'String',
                            formatter: function (val, item, rowIndex) {

                            // console.info(item['cilentId']);
                                if(val!=undefined&&val!=""){

                                   val=val;
                                }else{

                                	val="";
                                }
                                return '<span style=""><a href="#" onclick="DHDataQuery.orderPupo(\'' + item.clientTel + '\')">'
                                    + val + '</a></span>'
                            }
                           },
                            /*{field:'clientName', title:'客户姓名', width:150},*/
                            {field:'clientName', title:'客户姓名', width:150},
                            {field:'orderCount', title:'下单数/次', width:150},
                            {field:'articleCount', title:'商品总数/瓶', width:150},
                            {field:'orderMoney', title:'消费金额/元', width:150},

                        ]
                    ],
                //前五条记录加字体颜色
                   rowStyler:function(index,row){

                       if (index<5){
                       return 'color:red;';

                       }
                    }


            }).datagrid("clientPaging");
        },




       //订单详情列表初始化
        orderPupo: function (cilentTel) {

            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');

            //列表初始化
            details_mmg = $('#details_dg').datagrid({
                    url: '/DHData/detailpage',
                    queryParams: {cilentTel: cilentTel,firsttime: firsttime,lasttime:lasttime},
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
                            {field: 'articleName', title: '商品名称', width: 150},
                            {field: 'articleCount', title: '数量/瓶', width: 150, editor: 'numberbox'},
                            {field: 'articlePrice', title: '单价/元', width: 150, editor: 'numberbox'},
                            {field: 'articleMoney', title: '金额/元', width: 150, editor: 'numberbox'},

                        ]
                    ],


                }
            )
             $('#w').window('open');

        },
        //查询
        load: function(){
            var tel = $("#tel").val();
            var sorttype = $("#sorttype").combobox('getValue');
            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');

           $('#dg').datagrid('load',{
                tel:tel,
                sorttype:sorttype,
                firsttime: firsttime,
                lasttime: lasttime,



            });
        },
         savaExcel: function () {
                      var sava_Excel=$("#sava_Excel").val();
                      var tel=$("#tel").val();
                      var sorttype = $("#sorttype").combobox('getValue');
                      var firsttime = $("#firsttime").datetimebox('getValue');
                      var lasttime = $("#lasttime").datetimebox('getValue');
                   var pramas={"tel":tel,"sorttype":sorttype,"firsttime":firsttime,"lasttime":lasttime}
                     $.messager.confirm('', '您确定要导出EXCEL吗', function (r) {
                        if (r) {
                   $.ajax({
                       type:'POST',
                       url:'/excelDHPage?key=key',
                       data:pramas,
                       success:function(result){
                           if(result=='1'){
                               window.location.href=sava_Excel;
                           }else{
                                alert("导出失败！");
                                walletGrants.load();
                           }
                       }
                   });
                  }
                });

                },

         //关闭_弹出框
        closePopu: function () {
            $('#w').window('close', true);

        },

       //清空表单
       clearForm: function(formID,unload){

           $("#" + formID).each(function () {
               $("#tel").val('')
               $("#firsttime").datetimebox('clear');
               $("#lasttime").datetimebox('clear');
               $('#sorttype').combobox('clear');
            // iterate the elements within the form
            $(':input', this).each(function () {
                var type = this.type, tag = this.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file")

                    this.value = '';
                else if (type == 'checkbox' || type == 'radio')
                    this.checked = false;
                else if (tag == 'select')
                    $('#defraytype').combobox('clear');
            });
        });

                $('#dg').datagrid('load', {});


       }

    }

}


();
