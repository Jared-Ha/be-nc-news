const articlesRouter = require("express").Router();
const {
	getAllArticles,
	getArticleById,
	updateArticleById,
	getArticleCommentsByArtId,
} = require("../controllers/articles.controller");
const { postComment } = require("../controllers/comments.controller");

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.patch("/:article_id", updateArticleById);
articlesRouter.get("/:article_id/comments", getArticleCommentsByArtId);
articlesRouter.post("/:article_id/comments", postComment);

module.exports = articlesRouter;
