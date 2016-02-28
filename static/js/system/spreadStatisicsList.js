/**
 * Created by McGee on 15/6/3.
 */
$(document).ready(function(){
    attentionQuery.init();
});

var attentionQuery = function(){
   return{
       // 列表
       init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/attentionList',
                    params: $("#attentionListForm").serialize(),
                    method: 'post',
                    dataType: 'json',
                    pagination: true,
                    pageSize: 10,
                    pageList: [5,10,15],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden:true},
                            {field:'twocodeid', title:'地推编号', width:150, type:'String'},
                            {field:'spreadname', title:'姓名', width:150, type:'String'},
                            {field:'spreadtel', title:'联系电话', width:100},
                            {field:'spreadshop', title:'店名', width:100},
                            {field: 'spreadkind', title:'二维码', width:100, type: 'String', formatter:
                                function(val){
                                    if(val=='')
                                        return '';
                                    else if(val=='1')
                                        return '代言人';
                                    else if(val=='2')
                                        return '内部地推';
                                    else if(val=='3')
                                        return '商家(即饮)';
                                    else if(val=='4')
                                        return '商家(非即饮)';
                                }
                            },
                            {field:'countattention', title:'关注人数', width:100},
                            {field:'spreadtype', title:'状态', width:100, type: 'String', formatter:
                                function(val){
                                    if(val=='')
                                        return '';
                                    else if(val=='0')
                                        return '在职';
                                    else if(val=='1')
                                        return '空闲';
                                }
                            }
                        ]
                    ]
                });
       },

       //按条件查询
       load: function(){
           _mmg.load($("#attentionListForm").submit());
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
}();