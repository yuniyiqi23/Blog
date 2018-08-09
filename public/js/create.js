// 在 Html 页面加载完成后再加载此 js
$(window).load(function () {

    // 提交
    $('#submit').click(function () {
        let categoryName;
        $.each($('input:radio:checked'), function () {
            categoryName = $(this).val();
        })
        console.log('categoryName = ' + categoryName);
        if (categoryName) {
            let createPostform = $('#createPostform'); //得到form对象
            let tmpInput = $("<input type='text' name='categoryName'  hidden/>");
            tmpInput.attr("value", categoryName);
            createPostform.append(tmpInput);
            createPostform.submit();
        }
    })

})
