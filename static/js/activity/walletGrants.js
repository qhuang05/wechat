$(document).ready(function() {
	walletGrants.init();
});



var _mmg = null;

var walletGrants = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/walletGrant',
                    params: $("#GrantForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    pagination:true,
                    pageSize: 25,
                    pageList: [20,25,30],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden:true},

                            {field:'walletmoney', title:'代金券金额／元', width:120},

                            {
                            field: 'wallettype',
                            title: '优惠类型',
                            width: 120,
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
                            field: 'usestatus',
                            title: '使用状态',
                            width: 120,
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
                            field: 'usetype',
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
                         {field:'createtime', title:'发放时间', width:100},

                        ]
                    ]
                }).datagrid("clientPaging");
        },


        //查询
        load: function(){
           var walletmoney=$("#walletmoney").val();
           var usestatus = $("#usestatus").combobox('getValue');


           $('#dg').datagrid('load',{
                walletmoney: walletmoney,
                usestatus: usestatus,


            });
        },
          //批量发放代金卷
         sendWallet: function () {


             $.messager.confirm('', '您确定发放代金卷吗？', function (r) {
                if (r) {
                     $("#dg").datagrid("loading");
           $.ajax({
               type:'POST',
               url:'/sendtWallet',
               success:function(result){
                   if(result=='1'){
                        alert("发放代金券成功！");
                       $("#dg").datagrid("loaded");
                   }else{
                        alert("很抱歉！没有可发放的代金券！");
                       $("#dg").datagrid("loaded");
                       /* walletGrants.load();*/
                   }
               }
           });
          }
        });

        },
         //批量补发代金卷
         grantWallet: function () {


             $.messager.confirm('', '您确定补发代金卷吗？', function (r) {
                if (r) {
                    $("#dg").datagrid("loading");

           $.ajax({
               type:'POST',
               url:'/grantWallet',

               success:function(result){
                   if(result=='1'){
                       alert("补发代金券成功！");
                        $("#dg").datagrid("loaded");
                   }else{
                        alert("很抱歉！没有可补发的代金券！");
                       $("#dg").datagrid("loaded");

                   }
               }
           });
          }
        });

        },
        //导出excel
    savaExcel: function () {
           var sava_Excel=$("#sava_Excel").val();

           var walletmoney=$("#walletmoney").val();
           var usestatus = $("#usestatus").val();

           var pramas={"walletmoney":walletmoney,"usestatus":usestatus}
             $.messager.confirm('', '您确定要导出EXCEL吗', function (r) {
                if (r) {
           $.ajax({
               type:'POST',
               url:'/excelPage2?key=key',
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

       //清空表单
        clearForm: function(formID){
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

}

();
