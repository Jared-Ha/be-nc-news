const db = require("../connection.js");
const { checkUserExists } = require("../utils/check-user-exists.js");

exports.fetchAllUsers = () => {
	return db.query("SELECT * FROM  users;").then((result) => {
		return result.rows;
	});
};

exports.fetchUserByUsername = (userId) => {
	return db
		.query(
			"SELECT username, avatar_url, name FROM users WHERE users.username = $1;",
			[userId]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				console.log("hello in reject");
				return Promise.reject({
					status: 404,
					message: "User does not exist",
				});
			}
			return rows[0];
		});
};
