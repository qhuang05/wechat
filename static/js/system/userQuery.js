$(document).ready(function() {
	UserQuery.init();
});

/*
(function($){
			function pagerFilter(data){
				if ($.isArray(data)){	// is array
					data = {
						total: data.length,
						rows: data
					}
				}
				var dg = $(this);
				var state = dg.data('datagrid');
				var opts = dg.datagrid('options');
				if (!state.allRows){
					state.allRows = (data.rows);
				}
				var start = (opts.pageNumber-1)*parseInt(opts.pageSize);
				var end = start + parseInt(opts.pageSize);
				data.rows = $.extend(true,[],state.allRows.slice(start, end));
				return data;
			}

			var loadDataMethod = $.fn.datagrid.methods.loadData;
			$.extend($.fn.datagrid.methods, {
				clientPaging: function(jq){
					return jq.each(function(){
						var dg = $(this);
                        var state = dg.data('datagrid');
                        var opts = state.options;
                        opts.loadFilter = pagerFilter;
                        var onBeforeLoad = opts.onBeforeLoad;
                        opts.onBeforeLoad = function(param){
                            state.allRows = null;
                            return onBeforeLoad.call(this, param);
                        }
						dg.datagrid('getPager').pagination({
							onSelectPage:function(pageNum, pageSize){
								opts.pageNumber = pageNum;
								opts.pageSize = pageSize;
								$(this).pagination('refresh',{
									pageNumber:pageNum,
									pageSize:pageSize
								});
								dg.datagrid('loadData',state.allRows);
							}
						});
                        $(this).datagrid('loadData', state.data);
                        if (opts.url){
                        	$(this).datagrid('reload');
                        }
					});
				},
                loadData: function(jq, data){
                    jq.each(function(){
                        $(this).data('datagrid').allRows = null;
                    });
                    return loadDataMethod.call($.fn.datagrid.methods, jq, data);
                },
                getAllRows: function(jq){
                	return jq.data('datagrid').allRows;
                }
			})
		})(jQuery);

        function refer(){
            $("userDetails").submit();
        }

		function getData(){
			var rows = [];
			for(var i=1; i<=800; i++){
				var amount = Math.floor(Math.random()*1000);
				var price = Math.floor(Math.random()*1000);
				rows.push({
                    inv: "No"+i,
					date: $.fn.datebox.defaults.formatter(new Date()),
					name: 'Name '+i,
					amount: amount,
					price: price,
					cost: amount*price
				});
			}
			return rows;
		}
*/

var _mmg = null;

var UserQuery = function(){
    return{
        init: function(){
            _mmg=$('#dg').datagrid({
                    url:'/userPage',
                    params: $("#userInputForm").serialize(),
                    method: 'post',
                    rownumbers: true,
                    pagination:true,
                    pageSize: 15,
                    pageList: [10,15,20],
                    columns:[
                        [
                            {field:'ck', checkbox:true},
                            {field:'id', title:'id', hidden:true},
                            {field:'userCode', title:'登陆名', width:100},
                            {field:'userName', title:'用户名', width:100},
                            {field:'userTel', title:'联系电话', width:100},
                            {field:'createTime', title:'创建时间', width:100}
                        ]
                    ]
                }).datagrid("clientPaging");
        },

        //提交
        sava: function(){
            var id = $("#id").val();
            var params = $("#userDetails").serialize();

         if (id == "" || id == undefined || id == null) {
             //新增
             if (params.length == 0) {
                    alert("请输入配送站详细信息！");
                }
                if ($("#usercodes").val() == null || $("#usercodes").val() == undefined || $("#usercodes").val() == "") {
                    alert("请输入登陆名！");
                }
                if ($("#userName").val() == null || $("#userName").val() == undefined || $("#userName").val() == "") {
                    alert("请输入用户姓名！");
                }
                if ($("#userTel").val() == null || $("#userTel").val() == undefined || $("#userTel").val() == "") {
                    alert("请输入联系电话！");
                }
                if ($("#userPws").val() == null || $("#userPws").val() == undefined || $("#userPws").val() == "") {
                    alert("请输入密码！");
                }
                $.ajax({
                   type:"POST",
                   url:'/addUser',
                   dataType:'json',
                   data:params,
                   success: function (result) {
                       if(result=='1'){
                           alert("保存成功！");
                           UserQuery.clearForm('userDetails');
                           $('#w').window('close');
                           UserQuery.load();
                           return;
                       }else{
                           alert("保存失败！");
                           return;
                       }
                   }
               }
           )
         } else {
             //更新
             if (params.length == 0) {
                    alert("请输入配送站详细信息！");
                }
                if ($("#usercodes").val() == null || $("#usercodes").val() == undefined || $("#usercodes").val() == "") {
                    alert("请输入登陆名！");
                }
                if ($("#userName").val() == null || $("#userName").val() == undefined || $("#userName").val() == "") {
                    alert("请输入用户姓名！");
                }
                if ($("#userTel").val() == null || $("#userTel").val() == undefined || $("#userTel").val() == "") {
                    alert("请输入联系电话！");
                }
                if ($("#userPws").val() == null || $("#userPws").val() == undefined || $("#userPws").val() == "") {
                    alert("请输入密码！");
                }
                $.ajax({
                   type:"POST",
                   url:'/updateUser',
                   dataType:'json',
                   data:params,
                   success: function (result) {
                       if(result=='1'){
                           alert("修改成功！");
                           UserQuery.clearForm('userDetails');
                           $('#w').window('close');
                           UserQuery.load();
                           return;
                       }else{
                           alert("修改失败！");
                           return;
                       }
                   }
               }
           )
         }
           /* var params = $("#userDetails").serialize();
            $.ajax({
               type:'POST',
               url:'/addUser',
               dataType:'json',
               data: params,
               success:function(result){
                   if(result=='1'){
                       alert('保存成功！');
                       UserQuery.init();
                       $('#w').window('close')
                       return;
                   }else{
                       alert('保存失败！');
                       $('#w').window('close')
                       return;
                   }
               }

           });*/
        },

        //查询
        load: function(){
           var usercode=$("#usercode").val();
           var usertel = $("#usertel").val();
           var firsttime =$("#firsttime").datetimebox('getValue');
           var lasttime =$("#lasttime").datetimebox('getValue');
            /*alert(firsttime)
            alert(lasttime)*/


           $('#dg').datagrid('load',{
                usercode: usercode,
                usertel: usertel,
                firsttime:firsttime,
                lasttime:lasttime

            });
        },

        //删除
       del: function(){
           var chackedItem = $('#dg').datagrid('getChecked');
           var names = [];
           var userId;
           if(chackedItem.length=='0'|| chackedItem.length>'1'){
               alert("请选择一条记录！");
               return;
           }
           $.each(chackedItem, function(index, item ){
               userId = item.id;
           });

           $.ajax({
               type:'POST',
               url:'/delUser',
               data:'id='+userId,
               success:function(result){
                   if(result=='1'){
                       alert('删除成功！');
                       UserQuery.init();
                       return;
                   }else{
                       alert('删除失败！');
                       return;
                   }
               }
           })
       },

        //导出excel
    savaExcel: function () {
           var sava_Excel=$("#sava_Excel").val();
           var usercode=$("#usercode").val();
           var usertel = $("#usertel").val();
           var firsttime =$("#firsttime").datetimebox('getValue');
           var lasttime =$("#lasttime").datetimebox('getValue');
           var pramas={"usercode":usercode,"usertel":usertel,"firsttime":firsttime,"lasttime":lasttime}
             $.messager.confirm('', '您确定要导出EXCEL吗', function (r) {
                if (r) {
           $.ajax({
               type:'POST',
               url:'/excelPage?key=key',
               data:pramas,
               success:function(result){
                   if(result=='1'){
                       window.location.href=sava_Excel;
                   }else{
                        alert("导出失败！");
                        UserQuery.load();
                   }
               }
           });
          }
        });

        },
         //更新编辑
        edit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var user_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                user_id = item.id;

            });
            $.post('/selectUser', {id:user_id}, function (result) {
                if (result != null) {
                    //ShipDetails.listShip();
                    $("#id").val(result[0].id);
                    $("#usercodes").val(result[0].usercodes);
                    $("#userName").val(result[0].userName);
                    $("#userTel").val(result[0].userTel);
                    $("#userPws").val(result[0].userPws);

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
             $('#dg').datagrid('load', {});
       }

      /* clearForm: function(formID){
           $("#" + formID).each(function () {
            // iterate the elements within the form
            $(':input', this).each(function () {
                var type = this.type, tag = this.tagName.toLowerCase();
                if (type == 'text' || type == 'password' || tag == 'textarea' || type == "file" || type == "hidden")
                    this.value = '';
                else if (type == 'checkbox' || type == 'radio')
                    this.checked = false;
                else if (tag == 'select')
                    this.selectedIndex = '0';
            });
               var item = $('#details_dg').datagrid('getRows');
                if (item) {
                for (var i = item.length - 1; i >= 0; i--) {
                    var index = $('#details_dg').datagrid('getRowIndex', item[i]);
                    $('#details_dg').datagrid('deleteRow', index);
                    }
                }
        });
            $('#dg').datagrid('load', {});
       }*/
    }

}();
