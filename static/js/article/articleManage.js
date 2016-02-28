var _mmg = null;
var articleID;
var articleManage = function () {
    return {
        //品项列表显示
        init: function () {
            if ($("#msg1").val() == '1') {
                alert('提交成功！');

                _mmg = $('#dg').datagrid({
                    url: '/articlePage',
                    params: $("#articleInputForm").serialize(),
                    method: 'post',
                    pagination: true,
                    pageSize: 15,
                    pageList: [10, 15, 20],
                    columns: [
                        [
                            {field: 'ck', checkbox: true},
                            {field: 'id', title: 'id', hidden: true},
                            {field: 'productName', title: '品项名称', width: 80},
                            {field: 'articleName', title: '品项详细名称', width: 120},
                            {field: 'countryOrigin', title: '生产地', width: 50},
                            {field: 'articletype', title: '商品类别', width: 60},
                            {field: 'sequence', title: '品项排序', width: 60},
                            {field: 'articleExplain', title: '商品说明', width: 200},
                            {field: 'imgUrl', title: '图片存储地址', width: 350},
                            {field: 'smallUrl', title: '素材小图', width: 350},
                        ]
                    ]

                }).datagrid("clientPaging");

                return;

            }
            if ($("#msg1").val() == '0') {
                alert($("#msg").val())
                alert('提交失败！');
                articleManage.closePopu();
                return;
            }

            if ($("#msg1").val() == "" || $("#msg").val() == null || $("#msg").val() == undefined) {

                _mmg = $('#dg').datagrid({
                    url: '/articlePage',
                    params: $("#articleInputForm").serialize(),
                    method: 'post',
                    pagination: true,
                    pageSize: 15,
                    pageList: [10, 15, 20],
                    columns: [
                        [
                            {field: 'ck', checkbox: true},
                            {field: 'id', title: 'id', hidden: true},
                            {field: 'productName', title: '品项名称', width: 120},
                            {field: 'articleName', title: '品项详细名称', width: 150},
                            {field: 'countryOrigin', title: '生产地', width: 50},
                            {field: 'articletype', title: '商品类别', width: 60},
                            {field: 'sequence', title: '品项排序', width: 60},
                            {field: 'articleExplain', title: '商品说明', width: 200},
                            /*{field: 'titleUrl', title: '明细title图片路径', width: 350},*/
                            {field: 'imgUrl', title: '图片存储地址', width: 350},
                            {field: 'smallUrl', title: '素材小图', width: 350},
                        ]
                    ]
                }).datagrid("clientPaging");

            }
        },

        //打开弹出框
        openPopu: function (val) {
            if (val == '1') {
                //品项类别赋值
                 articleManage.listSort();
                articleManage.listtype();
                $('#w').window('open');
            } else {
                $('#w').window('open');
            }
        },

        //品项类别combox 初始化
        listtype: function () {
            $('#zone').combobox(
                {
                    url: '/article/zone',
                    valueField: 'value',
                    textField: 'text',
                    method: 'POST'
                }
            )
        },

         //品项类别combox 初始化
        listSort: function () {
            $.ajax({
                type: "post",
                url: '/listSort',
                data: {articleID: articleID},
                success: function (data1) {
                    data1 = eval("(" + data1 + ")");
                    console.info(data1)
                    $('#sort').combobox({
                        valueField: 'value',
                        textField: 'text',
                        data: data1
                    });

                }
            });
        },


        //查询
        load: function () {
            var productname = $("#productname1").val();
            var articletypes = $("#articletypes").combobox('getValue');

            $('#dg').datagrid('load', {
                productname: productname,
                articletypes: articletypes
            });
        },

        //关闭弹出框
        closePopu: function () {
            articleManage.clearForm('articleManage');
            $('#w').window('close');
        },


        del: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var articleIds = [];
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
                        var articleId;
                        $.each(chackedItem1, function (index, item) {
                            articleId = item.id;

                        });
                        $.ajax({
                            type: 'POST',
                            url: '/delArticle',
                            data: 'id=' + articleId,
                            success: function (result) {
                                if (result == '1') {
                                    alert("删除成功")
                                    articleManage.load();
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
                            if (articleIds == "") {
                                articleIds = "" + item.id + "";
                            } else {
                                articleIds = "" + item.id + "" + "," + articleIds;
                                ids = articleIds.split(',');
                            }
                        });
                        $.ajax({
                            type: 'POST',
                            url: '/delSomeArticle',
                            data: 'id=' + JSON.stringify(ids),
                            success: function (result) {
                                if (result == '1') {
                                    alert('删除成功！');
                                    articleManage.load();
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
        },
        //更新编辑
         edit: function () {
            var chackedItem = $('#dg').datagrid('getChecked');
            var names = [];
            var articleid;
            if (chackedItem.length == '0' || chackedItem.length > '1') {
                alert("请选择一条记录！");
                return;
            }
            $.each(chackedItem, function (index, item) {
                articleid = item.id;
            });
            $.post('/selectArticle', {id: articleid}, function (result) {
                if (result != null) {
                     articleID=result[0].articleId
                    var sort = result[0].sort;
                    articleManage.listtype();
                    $("#id").val(result[0].id);
                    $("#productName").val(result[0].productName);
                    $("#articleName").val(result[0].articleName);
                    $("#countryOrigin").val(result[0].countryOrigin);
                    $('#unitPrice').numberbox('setValue', result[0].unit_price);
                    $('#unitOriPrice').numberbox('setValue', result[0].unit_ori_price);
                    $("#zone").combobox({readonly: true});
                    $("#sort").combobox({readonly: false});
                    $("#zone").combobox('setValue', result[0].articleId);
                    //$("#sort").combobox('setValue', result[0].sort);
                    $('#sort').combobox({
                        onLoadSuccess :function(){
                        $('#sort').combobox("setValue",sort);//这里写设置默认值，
                        }
                    });
                    $("#articleExplain").val(result[0].articleExplain);
                    $("#imghead").attr("src", result[0].imgUrl)
                    $("#imghead2").attr("src", result[0].titleUrl)
                    $("#imghead1").attr("src", result[0].commodityImgUrl)
                    $("#imgheadSmall").attr("src", result[0].smallUrl)
                    $("#beerType").combobox('setValue', result[0].beerType);
                    $("#timeLimit").combobox('setValue', result[0].timeLimit);
                    $("#beerUnit").combobox('setValue', result[0].beerUnit);
                    $("#tagId").combobox('setValue', result[0].tagId);
                    articleManage.listSort();
                }
            }, 'json');

            articleManage.openPopu('0');

        }
    }
}()