const express = require("express");
const app = express();
const { getAllTopics } = require("./db/controllers/topics.controller.js");
const {
	getArticleById,
	getAllArticles,
	getArticleCommentsByArtId,
	updateArticleById,
} = require("./db/controllers/articles.controller.js");
const {
	postComment,
	deleteCommentById,
} = require("./db/controllers/comments.controller.js");
const { getAllUsers } = require("./db/controllers/users.controller.js");
const apiRouter = require("./db/routers/api-router.js");

app.use(express.json());

module.exports = app;

app.use("/api", apiRouter);

app.use((err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ msg: err.message });
	}
	next(err);
});

app.use((err, request, response, next) => {
	if (err.code === "22P02" || err.code === "23502") {
		response.status(400).send({ msg: "Bad request" });
	}
	next(err);
});

app.use((err, request, response, next) => {
	if (err.code === "23503" && err.constraint === "comments_article_id_fkey") {
		response.status(404).send({ msg: "Article does not exist" });
	}
	next(err);
});

app.use((err, request, response, next) => {
	if (err.code === "23503" && err.constraint === "comments_author_fkey") {
		response.status(404).send({ msg: "Username does not exist" });
	}
	next(err);
});

app.use((err, req, res, next) => {
	res.status(500).send({ message: "Internal Server Error" });
});
