const { fetchAllTopics } = require("../models/topics.model");

exports.getAllTopics = (req, res, next) => {
	console.log("hello controller");
	fetchAllTopics().then((topics) => {
		res.status(200).send({ topics });
	});
};
