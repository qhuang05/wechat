$(document).ready(function () {
    ShipDetails.init();
});

/*(function($){
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
 }*/

var _mmg = null;

var ShipDetails = function () {
    return {
        init: function () {
            _mmg = $('#dg').datagrid({
                url: '/shipPage',
                params: $("#ShipForm").serialize(),
                method: 'post',
                rownumbers: true,
                pagination: true,
                pageSize: 15,
                pageList: [10, 15, 20],
                columns: [
                    [
                        {field: 'ck', checkbox: true},
                        {field: 'id', title: 'id', hidden: true},
                        {field: 'shipName', title: '配送站名称', width: 100},
                        {field: 'shipTel', title: '联系电话', width: 100},
                        {field: 'shipAddress', title: '所在地址', width: 100},
                        {
                            field: 'shipZone', title: '所在区', width: 100, formatter: function (val) {
                            if (val == '')
                                return '';
                            else if (val == '思明区')
                                return '思明区';
                            else if (val == '湖里区')
                                return '湖里区';
                            else if (val == '集美区')
                                return '集美区';
                        }
                        },
                        {field: 'createTime', title: '创建时间', width: 100}
                    ]
                ]
            }).datagrid("clientPaging");
        },

        //查询
        load: function () {
            var selectshipname = $("#selectshipname").val();
            var selectshiptel = $("#selectshiptel").val();
            var firsttime =$("#firsttime").datetimebox('getValue');
            var lasttime =$("#lasttime").datetimebox('getValue');
            $('#dg').datagrid('load', {
                selectshipname: selectshipname,
                selectshiptel: selectshiptel,
                firsttime:firsttime,
                lasttime:lasttime
            });
        },

        //提交
        save: function () {
            var id = $("#id").val();
            var params = $("#shipDetails").serialize();

            if (id == "" || id == undefined || id == null) {
                //新增
                if (params.length == 0) {
                    alert("请输入配送站详细信息！");
                }
                if ($("#ship_Name").val() == null || $("#ship_Name").val() == undefined || $("#ship_Name").val() == "") {
                    alert("请输入配送站名！");
                }
                if ($("#ship_Tel").val() == null || $("#ship_Tel").val() == undefined || $("#ship_Tel").val() == "") {
                    alert("请输入联系电话！");
                }
                if ($("#ship_Address").val() == null || $("#ship_Address").val() == undefined || $("#ship_Address").val() == "") {
                    alert("请输入配送站地址！");
                }
                $.ajax({
                        type: "POST",
                        url: '/shipAdd',
                        dataType: 'json',
                        data: params,
                        success: function (result) {
                            if (result == '1') {
                                alert("保存成功！");
                                ShipDetails.clearForm('shipDetails');
                                $('#w').window('close');
                                ShipDetails.load();
                                return;
                            } else {
                                alert("保存失败！");
                                return;
                            }
                        }
                    }
                )
            } else {
                //编辑
                if (params.length == 0) {
                    alert("请输入配送站详细信息！");
                }
                if ($("#ship_Name").val() == null || $("#ship_Name").val() == undefined || $("#ship_Name").val() == "") {
                    alert("请输入配送站名！");
                }
                if ($("#ship_Tel").val() == null || $("#ship_Tel").val() == undefined || $("#ship_Tel").val() == "") {
                    alert("请输入联系电话！");
                }
                if ($("#ship_Address").val() == null || $("#ship_Address").val() == undefined || $("#ship_Address").val() == "") {
                    alert("请输入配送站地址！");
                }
                $.ajax({
                        type: "POST",
                        url: '/shipEdit',
                        dataType: 'json',
                        data: params,
                        success: function (result) {
                            if (result == '1') {
                                alert("修改成功！");
                                ShipDetails.clearForm('shipDetails');
                                $('#w').window('close');
                                ShipDetails.load();
                                return;
                            } else {
                                alert("修改失败！");
                                return;
                            }
                        }
                    }
                )
            }
        },

        //删除
        delete: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var ship_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                ship_id = item.id;
            });

            $.ajax({
                type: 'POST',
                url: '/shipDelete',
                data: 'id=' + ship_id,
                success: function (result) {
                    if (result == '1') {
                        alert('删除成功！');
                        ShipDetails.load();
                        return;
                    } else {
                        alert('删除失败！');
                        return;
                    }
                }
            })
            /* var checkedItems = $('#dg').datagrid('getChecked');
             var names = [];
             var ship_id;
             if (checkedItems.length ==0 || checkedItems.length >1){
             alert("请选择一条数据!");
             return;
             }
             $.each(checkedItems, function(index, item){
             ship_id = (names.push(item.id));
             $.ajax({
             type:'POST',
             url:'/shipDelete',
             dataType:'json',
             data:'id='+ship_id,
             success:function(result){
             if(result=='1'){
             alert('删除成功');
             ShipDetails.load();
             return;
             }else{
             alert('删除失败');
             return;
             }
             }
             })
             })*/
        },
        //配送站combox 初始化
        listShip: function () {
            $('#zone').combobox(
                {
                    url: '/customer/Ship_zone',
                    valueField: 'value',
                    textField: 'text',
                    method: 'POST'
                }
            )
        },
        //更新编辑
        edit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var ship_id;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                ship_id = item.id;
            });
            $.post('/selectShip', {id: ship_id}, function (result) {
                if (result != null) {
                    //ShipDetails.listShip();
                    $("#id").val(result[0].id);
                    $("#ship_Name").val(result[0].ship_Name);
                    $("#ship_Tel").val(result[0].ship_Tel);
                    $("#ship_Address").val(result[0].ship_Address);
                    $("#ship_Zone").combobox('setValue', result[0].ship_Zone);

                }

            }, 'json');
            $('#w').window('open');

        },
        //弹出框关闭
        closeDetails: function () {
            $("#ShipForm")[0].reset;
            $('#w').window('close');
        },
        //清空表单
        clearForm: function (formID) {
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
}()