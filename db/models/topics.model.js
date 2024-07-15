const db = require("../connection.js");

exports.fetchAllTopics = () => {
	return db.query(`SELECT * FROM topics`).then((result) => {
		return result.rows;
	});
};
