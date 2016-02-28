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
                            {field:'id', title:'id', hidden:true},
                            {field:'spreadname', title:'姓名', width:150, type:'String', formatter:
                                function(val,item,rowIndex){
                                    return '<span style=""><a href="#" onclick="SpreadQuery.detail(\''+item.id+'\')">'
                                        +val+'</a></span>'}
                            },
                            {field:'spreadtel', title:'联系电话', width:100},
                            {field:'spreadwechat', title:'微信号', width:100},
                            {field: 'twocodeimg', title:'二维码', width:100},
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
                            {field: 'remark', title:'备注', hidden: true},

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
       detail: function(val){
           $('#w').window('open');

       },


       //保存
       save: function(){
           spreadname = $("#spreadname").val();
           spreadtel = $("#spreadtel").val();
           spreadid = $("#spreadid").val();
           if (spreadname==""){
               alert("姓名不可为空！");
               return;
           }
           if (spreadtel==""){
               alert("电话不可为空！");
               return;
           }
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
                               //SpreadQuery.load();
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
           if (id == null|| id==undefined || id ==""){
               alert("请先新增地推人员信息！");
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