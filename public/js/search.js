$(window).load(function () {
    // 搜索
    $("#searchButton").click(function () {
        let keyword = $("#searchKeyword").val();
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
})