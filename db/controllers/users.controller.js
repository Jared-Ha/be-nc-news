const { fetchAllUsers, fetchUserByUsername } = require("../models/users.model");
const { use } = require("../routers/topics-router");

exports.getAllUsers = (req, res, next) => {
	fetchAllUsers().then((users) => {
		res.status(200).send({ users });
	});
};

exports.getUserByUsername = (req, res, next) => {
	const { username } = req.params;
	fetchUserByUsername(username)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch((err) => {
			next(err);
		});
};
