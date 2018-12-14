const express = require("express");
const router = express.Router();
const moment = require("moment");
const checkLogin = require("../middlewares/check").checkLogin;
const PostModel = require("../models/posts");
const CommentModel = require("../models/comments");
const TagModel = require("../models/tags");
const CategoryModel = require("../models/categories");
const DataState = require("../middlewares/enum").DataState;
const namespace = require("continuation-local-storage").getNamespace(
  "com.blog"
);
const winston = require("../lib/winston")

// GET /posts 所有用户或者特定用户的文章页
router.get("/", function(req, res, next) {
  winston.error('Test Winston log to console!!!');
  
  // console.log('Debug: ' + namespace.get('tid'));
  let authorId = req.query.author;
  let page = req.query.page || 1;
  // console.log('Debug: ' + namespace.get('tid'));

  Promise.all([
    PostModel.getPostsCount({ author: authorId }),
    PostModel.getPagingPosts({ author: authorId, page: page }),
    // 获取用户分类数据
    CategoryModel.getCategoryByAuthorId(authorId)
  ])
    .then(function(result) {
      // console.log('Debug: ' + namespace.get('tid') + 'ansy result');
      if (result[1].length >= 0) {
        let categoryList = null;
        if (result[2]) {
          categoryList = result[2].categories;
        }
        if (req.query.page) {
          res.render("components/posts-content", {
            postsCount: result[0],
            posts: result[1],
            categories: categoryList
          });
        } else {
          res.render("posts", {
            postsCount: result[0],
            posts: result[1],
            categories: categoryList
          });
        }
      }
    })
    .catch(next);
});

// POST /posts/create 发表一篇文章
router.post("/create", checkLogin, function(req, res, next) {
  const author = req.session.user._id;
  const title = req.body.title;
  const content = req.body.content;
  const categoryName = req.body.categoryName;
  let tags = null;
  // tags.map(ele => console.log(ele));
  if (req.body.tags !== "") {
    tags = req.body.tags.split(",");
  }

  // 校验参数
  try {
    if (!title.length) {
      throw new Error("请填写标题");
    }
    if (!content.length) {
      throw new Error("请填写内容");
    }
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("back");
  }

  let post = {
    author: author,
    title: title,
    content: content,
    category: categoryName,
    state: DataState.Publish,
    tags: tags
  };

  Promise.all([createPost(post), createTags(post.tags)])
    .then(function(result) {
      req.flash("success", "发表成功");
      // 发表成功后跳转到该文章页
      res.redirect("/posts/" + result[0]._id);
    })
    .catch(next);
});

async function createPost(post) {
  try {
    // 创建 post 并获取返回值
    const postResult = await PostModel.create(post);
    // 将 post 添加进 category
    await Promise.resolve(
      CategoryModel.addPostByCategory(
        post.author,
        post.category,
        postResult._id
      )
    );
    return Promise.resolve(postResult);
  } catch (error) {
    return Promise.reject(error);
  }
}

function submitTag(tag) {
  let query = { name: tag },
    update = { expire: { name: tag } },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

  return TagModel.findOneAndUpdate(query, update, options);
}

function createTags(tags) {
  if (tags) {
    return Promise.all(
      tags.map(tag => {
        return submitTag(tag);
      })
    );
  }
}

// GET /posts/create 发表文章
router.get("/create", checkLogin, function(req, res, next) {
  let authorId = req.session.user._id;
  CategoryModel.getCategoryByAuthorId(authorId)
    .then(function(result) {
      if (result) {
        res.render("create.ejs", {
          categories: result.categories
        });
      } else {
        res.render("create.ejs", {
          categories: null
        });
      }
    })
    .catch(next);
});

// GET /posts/:postId 单独一篇的文章页
router.get("/:postId", function(req, res, next) {
  // console.log('Debug: ' + namespace.get('tid'));
  const postId = req.params.postId;

  Promise.all([
    // 获取文章信息
    PostModel.getPostById(postId),
    // 获取该文章所有留言
    CommentModel.getComments(postId),
    // pv 加 1
    PostModel.incPv(postId)
  ])
    .then(function(result) {
      // console.log('Debug: ' + namespace.get('tid'));
      const post = result[0];
      const comments = result[1];
      if (!post) {
        throw new Error("该文章不存在");
      }

      res.render("post", {
        post: post,
        comments: comments
      });
    })
    .catch(next);
});

// GET /posts/:postId/edit 更新文章页
router.get("/:postId/edit", checkLogin, function(req, res, next) {
  const postId = req.params.postId;
  const authorId = req.session.user._id;

  Promise.all([
    PostModel.getRawPostById(postId),
    CategoryModel.getCategoryByAuthorId(authorId)
  ])
    .then(function(result) {
      if (!result[0]) {
        throw new Error("该文章不存在！");
      }
      if (authorId.toString() !== result[0].author._id.toString()) {
        throw new Error("权限不足！");
      }
      res.render("edit.ejs", {
        post: result[0],
        categories: result[1].categories
      });
    })
    .catch(next);
});

// POST /posts/:postId/edit 更新一篇文章
router.post("/:postId/edit", checkLogin, function(req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;
  const title = req.body.title;
  const content = req.body.content;
  const categoryName = req.body.categoryName;
  let tags = null;
  if (req.body.tags !== "" && req.body.tags) {
    tags = req.body.tags.split(",");
  }

  //校验参数
  try {
    if (!title.length) {
      throw new Error("请填写标题!");
    }
    if (!content.length) {
      throw new Error("请填写内容");
    }
  } catch (e) {
    req.flash("error", e.message);
    return res.redirect("back");
  }

  const value = {
    title: title,
    content: content,
    updatedAt: moment().format("YYYY-MM-DD HH:mm"),
    category: categoryName,
    tags: tags
  };

  PostModel.getRawPostById(postId)
    .then(function(post) {
      return updatePostById(post, author, value);
    })
    .then(() => {
      req.flash("success", "编辑文章成功");
      // 编辑成功后跳转到上一页
      res.redirect("/posts/" + postId);
    })
    .catch(next);
});

function updatePostById(post, author, value) {
  if (!post) {
    throw new Error("文章不存在");
  }
  if (post.author._id.toString() !== author.toString()) {
    throw new Error("没有权限");
  }

  return PostModel.updatePostById(post._id, value);
}

// GET /posts/:postId/remove 删除一篇文章
router.get("/:postId/remove", checkLogin, function(req, res, next) {
  const postId = req.params.postId;
  const author = req.session.user._id;

  PostModel.getRawPostById(postId)
    .then(function(post) {
      return Promise.all([
        delPostById(post, author),
        CategoryModel.delPostFromCategory(author, post.category, postId)
      ]);
    })
    .then(() => {
      req.flash("success", "删除文章成功");
      // 删除成功后跳转到主页
      res.redirect("/posts");
    })
    .catch(next);
});

function delPostById(post, author) {
  if (!post) {
    throw new Error("文章不存在");
  }
  if (post.author._id.toString() !== author.toString()) {
    throw new Error("没有权限");
  }
  return PostModel.delPostById(post._id);
}

module.exports = router;
