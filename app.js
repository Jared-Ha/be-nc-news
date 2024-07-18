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
const endpointsData = require("./endpoints.json");
const { getAllUsers } = require("./db/controllers/users.controller.js");

app.use(express.json());

module.exports = app;

app.get("/api", (req, res, next) => {
	res.status(200).send({ endpoints: endpointsData });
});

app.get("/api/topics", getAllTopics);

app.get("/api/users", getAllUsers);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", updateArticleById);

app.get("/api/articles/:article_id/comments", getArticleCommentsByArtId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteCommentById);

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
