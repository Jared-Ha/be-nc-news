const db = require("../connection.js");
const { checkArticleExists } = require("../utils/check-article-exists.js");

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

exports.fetchAllArticles = () => {
	return db
		.query(
			"SELECT articles.author, articles.title,articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY created_at DESC ;"
		)
		.then(({ rows }) => {
			return rows;
		});
};

exports.fetchCommentsByArtId = (article_id) => {
	const promisesArray = [];
	const queryPromise = db.query(
		"SELECT * FROM comments WHERE comments.article_id = $1 ORDER BY comments.created_at DESC",
		[article_id]
	);
	promisesArray.push(queryPromise);
	const doesArticleExistPromise = checkArticleExists(article_id);
	promisesArray.push(doesArticleExistPromise);
	return Promise.all(promisesArray).then(([query, doesArticleExist]) => {
		if (query.rows.length === 0 && !doesArticleExist) {
			return Promise.reject({
				status: 404,
				message: "Article does not exist",
			});
		}
		return query.rows;
	});
};

exports.patchArticleById = (incVotes, articleId) => {
	return db
		.query(
			"UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *",
			[incVotes, articleId]
		)
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
