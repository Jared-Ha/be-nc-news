const db = require("../connection.js");

exports.insertComment = (username, commentBody, articleId) => {
	if (commentBody.length === 0 || !commentBody) {
		return Promise.reject({ status: 400, message: "Comment field is empty" });
	}
	if (username.length === 0 || !username) {
		return Promise.reject({ status: 400, message: "Username is empty" });
	}
	return db
		.query(
			`INSERT INTO comments (author, body, article_id) VALUES($1,$2,$3) RETURNING*;`,
			[username, commentBody, articleId]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};
