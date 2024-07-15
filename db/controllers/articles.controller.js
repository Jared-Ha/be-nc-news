const {
	fetchArticleById,
	fetchAllArticles,
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
