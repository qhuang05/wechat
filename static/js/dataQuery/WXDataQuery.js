$(document).ready(function() {
	WXDataQuery.init();

});



var _mmg = null;

var WXDataQuery = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({

                    url:'/WXDataQueryPage',
                    params: $("#WXDataForm").serialize(),
                    fitColumns : true,
                    showFooter:true,
                    rownumbers: true,
                    pagination:true,
                    pageSize: 15,
                    pageList: [10,15,20],
                    idField: 'cilentId', //主键
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
                                return '<span style=""><a href="#" onclick="WXDataQuery.orderPupo(\'' + item.cilentId + '\')">'
                                    + val + '</a></span>'
                            }
                           },
                            /*{field:'clientName', title:'客户姓名', width:150},*/
                            {field:'clientName', title:'客户姓名', width:150},
                            {field:'orderCount', title:'下单数/次', width:150},
                            {field:'articleCount', title:'商品总数/瓶', width:150},
                            {field:'walletMoney', title:'代金券金额/元', width:150},
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


        //数据详情
        detail: function (firsttime, lasttime) {
            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');

            $.post('/clientData/detail', {firsttime: firsttime,lasttime:lasttime}, function (result) {
                if (result != null) {

                     $('#w').window('open');
                    /*WXDataQuery.addPopu('2', id, orderType);*/
                }
            }, 'json');
        },


       //详情列表初始化
        orderPupo: function (cilentId) {


            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');



            //清空列表结果集
          //  $('#details_dg').datagrid('loadData', {total: 0, rows: []});
            //列表初始化
            details_mmg = $('#details_dg').datagrid({
                    url: '/WXData/detailpage',
                    queryParams: {cilentId: cilentId,firsttime: firsttime,lasttime:lasttime},
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
            var defraytype = $("#defraytype").combobox('getValue');
            var firsttime = $("#firsttime").datetimebox('getValue');
            var lasttime = $("#lasttime").datetimebox('getValue');

           $('#dg').datagrid('load',{
                tel:tel,
                sorttype:sorttype,
                defraytype: defraytype,
                firsttime: firsttime,
                lasttime: lasttime,



            });
        },

        savaExcel: function () {
              var sava_Excel=$("#sava_Excel").val();
              var tel=$("#tel").val();
              var sorttype = $("#sorttype").combobox('getValue');
              var defraytype = $("#defraytype").combobox('getValue');
              var firsttime = $("#firsttime").datetimebox('getValue');
              var lasttime = $("#lasttime").datetimebox('getValue');
           var pramas={"tel":tel,"sorttype":sorttype,"defraytype":defraytype,"firsttime":firsttime,"lasttime":lasttime}
             $.messager.confirm('', '您确定要导出EXCEL吗', function (r) {
                if (r) {
           $.ajax({
               type:'POST',
               url:'/excelWXPage?key=key',
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
