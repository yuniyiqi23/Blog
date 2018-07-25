$("#addCategory").click(function () {
    let category = $("#categoryName").val();
    // console.log('addCategory :' + category);
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "http://localhost:3000/categories/addCategory",
        data: JSON.stringify({ 'category': category }),
        success: function (data) {
            // console.log(data);
            $("#div_category").html(data);
        },
        error: function (msg) {
            console.log(msg);
        }
    });
});

$("#delCategory").click(function () {
    let category = $("#categoryName").val();
    // console.log('delCategory :' + category);
    $.ajax({
        type: "POST",
        contentType: "application/json;charset=utf-8",
        url: "http://localhost:3000/categories/delCategory",
        data: JSON.stringify({ 'category': category }),
        success: function (data) {
            // console.log(data);
            $("#div_category").html(data);
        },
        error: function (msg) {
            console.log(msg);
        }
    });
});