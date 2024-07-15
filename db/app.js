const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics.controller");

module.exports = app;

app.get("/api/topics", getAllTopics);
