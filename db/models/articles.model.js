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

exports.fetchAllArticles = (sortBy = "created_at", order = "DESC", topic) => {
	if (order === "") order = "DESC";
	if (sortBy === "") sortBy = "created_at";
	const greenListSortBy = [
		"created_at",
		"title",
		"author",
		"article_id",
		"topic",
		"votes",
		"article_img_url",
		"comment_count",
	];
	const greenListOrder = ["ASC", "DESC", "asc", "desc"];
	if (!greenListSortBy.includes(sortBy)) {
		return Promise.reject({ status: 400, message: "Invalid sort by query" });
	}
	if (!greenListOrder.includes(order)) {
		return Promise.reject({ status: 400, message: "Invalid order query" });
	}
	let sqlString =
		"SELECT articles.author, articles.title,articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id=comments.article_id";
	if (topic) {
		sqlString += ` WHERE articles.topic = '${topic}'`;
	}
	sqlString += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order};`;
	return db.query(sqlString).then(({ rows }) => {
		if (rows.length === 0) {
			return Promise.reject({
				status: 404,
				message: "No articles found on that topic",
			});
		}
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
