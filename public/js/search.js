$(window).load(function () {
    // 搜索
    $("#searchButton").click(function () {
        let keyword = $("#searchKeyword").val();
        // console.log(keyword);
        window.location.href = "http://" + window.location.host + "/posts/search?keyword=" + keyword;
    });
})