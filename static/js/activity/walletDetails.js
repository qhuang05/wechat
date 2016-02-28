$(document).ready(function() {
	walletDetails.init();
});



var _mmg = null;

var walletDetails = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/walletPage',
                    params: $("#walletForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    pagination:true,
                    pageSize: 15,
                    pageList: [10,15,20],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden:true},
                            {field:'clientname', title:'客户姓名', width:100},
                            {field:'clienttel', title:'联系电话', width:100},
                            {field:'walletmoney', title:'代金券金额／元', width:100},

                            {
                            field: 'wallettype',
                            title: '优惠类型',
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
                            },
                               {
                            field: 'userstatus',
                            title: '使用状态',
                            width: 100,
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
                            width: 100,
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
                            {field:'usetime', title:'使用时间', width:100}

                        ]
                    ]
                }).datagrid("clientPaging");
        },


        //查询
        load: function(){
           var clientname=$("#clientname").val();
           var clienttel = $("#clienttel").val();


           $('#dg').datagrid('load',{
                clientname: clientname,
                clienttel: clienttel,


            });
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
