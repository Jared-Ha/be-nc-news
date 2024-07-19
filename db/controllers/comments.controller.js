const {
	insertComment,
	removeCommentById,
	patchCommentById,
} = require("../models/comments.model");

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

exports.deleteCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	removeCommentById(comment_id)
		.then(() => {
			res.status(204).send();
		})
		.catch((err) => {
			next(err);
		});
};

exports.updateCommentById = (req, res, next) => {
	const { comment_id } = req.params;
	const { inc_votes } = req.body;

	patchCommentById(inc_votes, comment_id)
		.then((updatedComment) => {
			res.status(200).send({ updatedComment });
		})
		.catch((err) => {
			next(err);
		});
};
