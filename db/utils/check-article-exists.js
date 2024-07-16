const db = require("../connection.js");

exports.checkArticleExists = (articleId) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
		.then((result) => {
			return result.rows.length !== 0;
		});
};
