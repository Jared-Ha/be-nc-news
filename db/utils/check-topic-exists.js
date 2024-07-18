const db = require("../connection.js");

exports.checkTopicExists = (topicName) => {
	return db
		.query(`SELECT * FROM topics WHERE slug = $1`, [topicName])
		.then((result) => {
			return result.rows.length === 1;
		})
		.catch((err) => {
			return err;
		});
};
