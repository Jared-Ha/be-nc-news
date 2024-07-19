const {
	deleteCommentById,
	updateCommentById,
} = require("../controllers/comments.controller");
const commentsRouter = require("express").Router();

commentsRouter.delete("/:comment_id", deleteCommentById);
commentsRouter.patch("/:comment_id", updateCommentById);

module.exports = commentsRouter;
