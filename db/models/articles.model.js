const db = require("../connection.js");

exports.fetchArticleById = (articleId) => {
	return db
		.query(`SELECT * FROM articles WHERE article_id=$1`, [articleId])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({
					status: 404,
					message: "Article does not exist",
				});
			}
			return rows[0];
		});
};
