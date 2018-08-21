// 在 Html 页面加载完成后再加载此 js
$(window).load(function () {
    // 提交 post
    $('#submit').click(function () {
        let categoryName;
        $.each($('input:radio:checked'), function () {
            categoryName = $(this).val();
        })
        let tagList = new Array();
        $.each($('.delete.icon'), function () {
            console.log('tag = ' + $(this).attr("id"));
            tagList.push($(this).attr("id"));
        })
        console.log(tagList);
        if (categoryName) {
            const form = $('#createPostform'); //得到form对象
            const tmpInput = $("<input type='text' name='categoryName' hidden/>");
            tmpInput.attr("value", categoryName);
            form.append(tmpInput);
            const tagsInput = $("<input type='text' name='tags' hidden/>");
            tagsInput.attr("value", tagList);
            form.append(tagsInput);
            form.submit();
        }
    });

    // 实时搜索 tags
    $("#search-text").keyup(function () {
        let paremeter = $("#search-text").val();
        $.get("http://" + window.location.host + "/tags", { 'tag': paremeter }, function (data) {
            let content = data.map(function (ele) {
                return { title: ele.name }
            });
            // console.log(content);
            $('.ui.search')
                .search({
                    source: content
                })
        })
    });
    $('#search-text').keydown(function () {
        $('#search-result').empty();
    });
    $('#search-text').blur(function () {
        $('#search-result').empty();
    });

    // 添加 Tag
    $('#addTag').click(function () {
        let value = $("#search-text").val();
        let tagList = new Array();
        tagList.forEach
        $.each($('.delete.icon'), function () {
            // console.log('tag = ' + $(this).attr("id"));
            tagList.push($(this).attr("id"));
        })
        if (tagList.includes(value)) {
            $('#tag_label').show().delay(1200).fadeOut();
        } else {
            const tag_label = $('#tag_label');
            const tag = $("<a class='ui label'>" + value + "<i id='" + value + "' class='delete icon'></i></a>");
            tag_label.before(tag);
        }
    })

    // 删除 Tag
    $("body").on("click", ".delete.icon", function () {
        let tag = $(this).attr("id");
        console.log(tag);
        $(this).parent().remove();
    });

})
