const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics.controller.js");
const {
	getArticleById,
	getAllArticles,
} = require("./controllers/articles.controller.js");
const endpointsData = require("../endpoints.json");

module.exports = app;

app.get("/api", (req, res, next) => {
	res.status(200).send({ endpoints: endpointsData });
});

app.get("/api/topics", getAllTopics);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ msg: err.message });
	}
	next(err);
});

app.use((err, request, response, next) => {
	if (err.code === "22P02") {
		response.status(400).send({ msg: "Bad request" });
	}
	next(err);
});

app.use((err, req, res, next) => {
	res.status(500).send({ message: "Internal Server Error" });
});
