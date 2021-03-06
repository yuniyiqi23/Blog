// 在 Html 页面加载完成后再加载此 js
(function (window, undefined) {
    // Ajax 添加一个分类
    $("#addCategory").click(function () {
        let category = $("#categoryName").val();
        console.log('addCategory :' + category);
        $.ajax({
            type: "POST",
            contentType: "application/json;charset=utf-8",
            url: "http://" + window.location.host + "/categories/addCategory",
            data: JSON.stringify({ 'category': category }),
            success: function (data) {
                console.log(data);
                $("#div_category").html(data);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    });

    // Ajax 删除一个分类
    $("#delCategory").click(function () {
        $.each($('input:radio:checked'), function () {
            let category = $(this).val();
            // console.log('delCategory :' + category);
            $.ajax({
                type: "POST",
                contentType: "application/json;charset=utf-8",
                url: "http://" + window.location.host + "/categories/delCategory",
                data: JSON.stringify({ 'category': category }),
                success: function (data) {
                    // console.log(data);express mongodb 事务
                    $("#div_category").html(data);
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        });
    });

    // 设置最后一个checkbox为选中值
    $('input:radio:last').attr('checked', 'checked');
    
    // 修改提交的参数值
    $('input:radio').click(function (event) {
        console.log($(this).val());
        $("#categoryValue").attr("value", $(this).val());
    })

    // 设置 Category 初始值
    $.each($('input:radio:checked'), function () {
        $("#categoryValue").attr("value", $(this).val());
    });

})(window);
