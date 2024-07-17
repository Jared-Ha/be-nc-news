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
	fetchAllArticles().then((articles) => {
		res.status(200).send({ articles });
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
