const {
	fetchArticleById,
	fetchAllArticles,
	fetchCommentsByArtId,
	patchArticleById,
} = require("../models/articles.model");

exports.getArticleById = (req, res, next) => {
	const { article_id } = req.params;
	fetchArticleById(article_id)
		.then((articleObj) => {
			res.status(200).send({ article: articleObj });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAllArticles = (req, res, next) => {
	const { sort_by } = req.query;
	const { order } = req.query;
	const { topic } = req.query;
	const { searchTerm } = req.query;
	fetchAllArticles(sort_by, order, topic, searchTerm)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getArticleCommentsByArtId = (req, res, next) => {
	const { article_id } = req.params;
	fetchCommentsByArtId(article_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.updateArticleById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	patchArticleById(inc_votes, article_id)
		.then((updatedArticle) => {
			res.status(200).send({ updatedArticle });
		})
		.catch((err) => {
			next(err);
		});
};
