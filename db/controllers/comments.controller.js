const { insertComment } = require("../models/comments.model");

exports.postComment = (req, res, next) => {
	const { article_id } = req.params;
	const { username, body } = req.body;
	insertComment(username, body, article_id)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch((err) => {
			next(err);
		});
};
