$(window).load(function () {
    // 搜索按钮
    $("#searchButton").click(function () {
        //关键字过滤特殊符号
        let keyword = stripscript($("#searchKeyword").val());
        console.log('search keyword : ' + keyword);
        $.ajax({
            type: "GET",
            contentType: "application/json;charset=utf-8",
            url: "http://" + window.location.host + "/posts/search?keyword=" + keyword,
            success: function (data) {
                $("#posts").html(data);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    });

    function stripscript(s) {
        var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）&;—|{}【】‘；：”“'。，、？]")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + s.substr(i, 1).replace(pattern, '');
        }
        return rs;
    }

})