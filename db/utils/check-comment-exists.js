const db = require("../connection.js");

exports.checkCommentExists = (commentId) => {
	return db
		.query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
		.then((result) => {
			return result.rows.length === 1;
		})
		.catch((err) => {
			return err;
		});
};
