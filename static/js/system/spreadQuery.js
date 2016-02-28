/**
 * Created by McGee on 15/6/3.
 */
$(document).ready(function(){
    SpreadQuery.init();
});

var SpreadQuery = function(){
   return{
       // 列表
       init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/spreadList',
                    params: $("#spreadQueryForm").serialize(),
                    method: 'post',
                    dataType: 'json',
                    pagination:true,
                    pageSize: 10,
                    pageList: [5,10,15],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden: true},
                            {field:'twocodeid', title:'地推编号', width:150, type:'String', formatter:
                                function(val, item,rowIndex){
                                    return '<span style=""><a href="#" onclick="SpreadQuery.detail(\''+item.id+'\')">'
                                    +val+'</a></span>'}
                            },
                            {field:'spreadname', title:'姓名', width:150, type:'String'},
                            {field:'spreadtel', title:'联系电话', width:100},
                            {field:'spreadkind', title:'地推类型', width:100, formatter:
                                function(val){
                                    if(val=='')
                                        return '';
                                    else if(val=='1')
                                        return '代言人(个人)';
                                    else if(val=='2')
                                        return '内部地推(个人)';
                                    else if(val=='3')
                                        return '即饮(商家)';
                                    else if(val=='4')
                                        return '非即饮(商家)';
                                }
                            },
                            {field: 'twocodeimg', title:'二维码', width:100, formatter:
                                function(val){
                                    if(val=='')
                                        return '无';
                                    else
                                        return '有';
                                }
                            },
                            {field:'createTime', title:'创建时间', width:100},
                            {field:'spreadtype', title:'状态', width:100, type: 'String', formatter:
                                function(val){
                                    if(val=='')
                                        return '';
                                    else if(val=='0')
                                        return '在职';
                                    else if(val=='1')
                                        return '空闲';
                                }
                            },
                            {field: 'remark', title:'备注', hidden: true}

                        ]
                    ]
                });
       },

       //按条件查询
       load: function(){
           _mmg.load($("#spreadQueryForm").submit());
       },


       //列表初始化
       spreadattachpage: function(){
           attach_mmg = $('#attach_dg').datagrid({
                  url:'',
                  method: 'post',
                  dataType: 'json',
                  singleSelect: true,
                  toolbar: '#tb',
				  onClickRow: 'onClickRow',
                  columns:[
                      [
                          {field:'id', title:'id', hidden:true},
                          {field:'spreadname', title:'姓名', width:100},
                          {field:'spreadtel', title:'电话', width:100},
                          {field:'attenCount', title:'关注数量', width:100},
                          {field:'singleCount', title:'下单数量', width:100}
                      ]
                  ]
           }
        )
       },

       //新增弹出框
       addPopu: function(){
           //配送站赋值
           $('#spreadattach').combobox(
               {
                   url:'/spread/combobox',
                   valueField:'value',
                   textField:'text',
                   method:'POST'
               }
           )
           SpreadQuery.spreadattachpage();
           $('#w').window('open');
       },

       ////测试token
       //test_token: function(){
       //    $.ajax(
       //        {
       //            type:"POST",
       //            url:'/spread/testtoken',
       //            success: function(result){
       //                alert(result);
       //            }
       //        }
       //    )
       //},

       //批量生成地推弹出框
       batchSpread: function(){
           $('#pop').window('open');
       },

       //批量生成地推
       batchfix: function(){
           $.ajax(
               {
                   type:"POST",
                   url:'/spread/batchfix',
                   data:$("#spreadbatch").serialize(),
                   success: function(result) {
                       if(result!=null){
                           $('#pop').window('close');
                       }
                   }
               }
           );
       },


       //关闭页面
       closePopu: function(val){
           SpreadQuery.clearForm(val);
           SpreadQuery.load();
           $('#w').window('close');
       },


       //删除记录
       del: function(){

       },


       //编辑记录
       editPopu: function(){

       },


       //地推人员详情
       detail: function(id){
           $.post('/spread/detail', {id: id}, function (result) {
                if (result != null) {
                    $("#spreadid").val(result[0].spreadid);
                    $("#spreadname").val(result[0].spreadname);
                    $("#spreadtel").val(result[0].spreadtel);
                    $("#spreadwachat").val(result[0].spreadwachat);
                    $("#spreadpwd").val(result[0].spreadpwd);
                    $("#twocodeid").val(result[0].twocodeid);
                    $("#fullmoney").val(result[0].fullmoney);
                    $("#spreadshop").val(result[0].spreadshop);
                    $("#spreadpwd").val(result[0].spreadpwd);

                    $("#mstime").val(result[0].mstime);
                    $("#metime").val(result[0].metime);
                    $("#astime").val(result[0].astime);
                    $("#aetime").val(result[0].aetime);
                    $("#nstime").val(result[0].nstime);
                    $("#netime").val(result[0].netime);
                    $("#sstime").val(result[0].sstime);
                    $("#setime").val(result[0].setime);

                    if (result[0].spreadtype =='0')
                        $("#spreadtype").combobox('setValue','在职');
                    else if (result[0].spreadtype =='01')
                        $("#spreadtype").combobox('setValue','空闲');
                    else if (result[0].spreadtype == '')
                        $("#spreadtype").combobox('setValue', '');

                    if (result[0].spreadkind =='1')
                        $("#spreadkind").combobox('setValue','代言人(个人)');
                    else if (result[0].spreadkind =='2')
                        $("#spreadkind").combobox('setValue','内部地推(个人)');
                    else if (result[0].spreadkind == '3')
                        $("#spreadkind").combobox('setValue', '即饮(商家)');
                    else if (result[0].spreadkind == '4')
                        $("#spreadkind").combobox('setValue', '非即饮(商家)');
                    else if (result[0].spreadkind == '')
                        $('#spreadkind').combobox('setValue', '');

                    $("#remark").val(result[0].remark);
                    $("#twocodeimg").val(result[0].twocodeimg);
                    SpreadQuery.ecitablenot();
                    $("save").hide;

                    $('#w').window('open');
                }
            }, 'json');
       },


       //Not editable 不可编辑
       ecitablenot: function(){
           $("#twocodeid").attr('readOnly', 'true');
           $("#spreadname").attr('readOnly', 'true');
           $("#spreadtel").attr('readOnly', 'true');
           $("#spreadwachat").attr('readOnly', 'true');
           $("#spreadpwd").attr('readOnly', 'true');
           $("#spreadtype").attr('disabled', 'disabled');
           $("#spreadkind").attr('disabled', 'disabled');
           $("#spreadattach").attr('disabled', 'disabled');
           $("#remark").attr('readOnly', 'true');
           $("#twocodeimg").attr('readOnly', 'true');
           $("#fullmoney").attr('disabled', 'disabled');
           $("#spreadshop").attr('disabled', 'disabled');


           $("#mstime").attr('disabled', 'disabled');
           $("#metime").attr('disabled', 'disabled');
           $("#astime").attr('disabled', 'disabled');
           $("#aetime").attr('disabled', 'disabled');
           $("#nstime").attr('disabled', 'disabled');
           $("#netime").attr('disabled', 'disabled');
       },



       //保存
       save: function(){
           spreadid = $("#spreadid").val();

           if(spreadid!=null || spreadid!=""){
               $.ajax({
                       type:"POST",
                       url:'/spreadSave',
                       data:$("#spreadPopu").serialize(),
                       success: function (result) {
                           if(result!=''){
                               alert("保存成功！");
                               //SpreadQuery.clearForm('spreadPopu');
                               $('#spreadid').val(result);
                               return;
                           }else{
                               alert("保存失败！");
                               return;
                           }
                       }
                   }
               );
           }else{
               SpreadQuery.clearForm('spreadPopu');
               $('#w').window('close');
               return;
           }
       },

       //生成二维码
       generate_twocode: function(){
           id =  $('#spreadid').val();
           twocode = $('#twocodeimg').val();
           if (id == null|| id==undefined || id ==""){
               alert("请先新增地推人员信息！");
               return;
           }
           if (twocode != null || twocodeimg != undefined || twocodeimg !="" ){
               alert("二维码已生成！ ");
               return;
           }
           $.ajax({
                   type:"POST",
                   url:'/spread/twocode',
                   data:{'spreadid': id},
                   success: function(result) {
                       if(result!=null){
                           $('#twocodeimg').val(result)
                       }
                   },
                   error:function(e){
                       alert(e)
                   }
               }
           );
       },



       //查看订单详情
        editSpreadPopu: function (orderId, orderType) {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var spreadid;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                spreadid = item.id;
            });

            $.post('/spread/editdetails', {id: spreadid}, function (result) {
                if (result != null) {
                    $("#spreadid").val(result[0].spreadid);
                    $("#spreadname").val(result[0].spreadname);
                    $("#spreadtel").val(result[0].spreadtel);
                    $("#spreadwachat").val(result[0].spreadwachat);
                    $("#spreadpwd").val(result[0].spreadpwd);
                    $("#twocodeid").val(result[0].twocodeid);
                    $("#spreadpwd").val(result[0].spreadpwd);

                    $("#spreadshop").val(result[0].spreadshop);
                    $("#fullmoney").val(result[0].fullmoney);

                    $("#mstime").val(result[0].mstime);
                    $("#metime").val(result[0].metime);
                    $("#astime").val(result[0].astime);
                    $("#aetime").val(result[0].aetime);
                    $("#nstime").val(result[0].nstime);
                    $("#netime").val(result[0].netime);

                    $("#sstime").val(result[0].sstime);
                    $("#setime").val(result[0].setime);

                    if (result[0].spreadtype =='0')
                        $("#spreadtype").combobox('setValue','在职');
                    else if (result[0].spreadtype =='01')
                        $("#spreadtype").combobox('setValue','空闲');
                    else if (result[0].spreadtype == '')
                        $("#spreadtype").combobox('setValue', '');

                    if (result[0].spreadkind =='1')
                        $("#spreadkind").combobox('setValue','代言人(个人)');
                    else if (result[0].spreadkind =='2')
                        $("#spreadkind").combobox('setValue','内部地推(个人)');
                    else if (result[0].spreadkind == '3')
                        $("#spreadkind").combobox('setValue', '即饮(商家)');
                    else if (result[0].spreadkind == '4')
                        $("#spreadkind").combobox('setValue', '非即饮(商家)');
                    else if (result[0].spreadkind == '')
                        $('#spreadkind').combobox('setValue', '');

                    $("#remark").val(result[0].remark);
                    $("#twocodeimg").val(result[0].twocodeimg);
                    $("#twocodeid").attr('readOnly', 'true');
                }
            }, 'json');
            $('#w').window('open');
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
       }


   }
}()