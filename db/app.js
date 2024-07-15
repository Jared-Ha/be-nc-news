const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics.controller");
const endpointsData = require("../endpoints.json");

module.exports = app;

app.get("/api", (req, res, next) => {
	res.status(200).send({ endpoints: endpointsData });
});

app.get("/api/topics", getAllTopics);

app.use((err, request, response, next) => {
	response.status(500).send({ message: "Internal Server Error" });
});
