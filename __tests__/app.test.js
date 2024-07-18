const request = require("supertest");
require("jest-sorted");
const app = require("../db/app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");
const endpointsData = require("../endpoints.json");
const { checkCommentExists } = require("../db/utils/check-comment-exists.js");

beforeEach(() => {
	return seed(testData);
});

afterAll(() => {
	return connection.end();
});

describe("/api", () => {
	it("GET 200 - responds with a JSON object detailing all available endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoints } }) => {
				expect(endpoints).toEqual(endpointsData);
			});
	});
	it("GET 200 - each endpoint has the correct key-value pairs", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body: { endpoints } }) => {
				for (let endpoint in endpoints) {
					if (endpoint !== "GET /api") {
						expect(endpoints[endpoint].hasOwnProperty("description")).toBe(
							true
						);
						expect(endpoints[endpoint].hasOwnProperty("queries")).toBe(true);
						expect(endpoints[endpoint].hasOwnProperty("exampleResponse")).toBe(
							true
						);
					}
				}
			});
	});
});

describe("/api/topics", () => {
	it("GET 200 - responds with an array of topic objects with the properties 'slug' and 'description'", () => {
		return request(app)
			.get("/api/topics")
			.expect(200)
			.then(({ body: { topics } }) => {
				expect(Array.isArray(topics)).toBe(true);
				expect(topics.length).toBe(3);
				topics.forEach((topic) => {
					expect(topic).toEqual({
						slug: expect.any(String),
						description: expect.any(String),
					});
				});
			});
	});
});

describe("/api/articles/:article_id", () => {
	it("GET 200 - responds with the article object that corresponds to the article ID'", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toEqual({
					article_id: 3,
					title: "Eight pug gifs that remind me of mitch",
					topic: "mitch",
					author: "icellusedkars",
					body: "some gifs",
					created_at: expect.any(String),
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					votes: 0,
					comment_count: 2,
				});
			});
	});
	it("GET 404 - sends 404 status and an error message when given a valid but non-existent article ID", () => {
		return request(app)
			.get("/api/articles/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Article does not exist");
			});
	});
	it("GET 400 - sends 400 status and an error message when given an invalid article ID", () => {
		return request(app)
			.get("/api/articles/not-an-article")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("PATCH 200 : increments the number of votes for the article ID, by the number sent in the request", () => {
		const patchVotes = { inc_votes: 1 };
		const expectedUpdatedArticle = {
			article_id: 3,
			title: "Eight pug gifs that remind me of mitch",
			topic: "mitch",
			author: "icellusedkars",
			body: "some gifs",
			created_at: expect.any(String),
			article_img_url:
				"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
			votes: 1,
		};
		return request(app)
			.patch("/api/articles/3")
			.send(patchVotes)
			.expect(200)
			.then(({ body: { updatedArticle } }) => {
				expect(updatedArticle).toEqual(expectedUpdatedArticle);
			});
	});
	it("PATCH 200 : decrements the number of votes for the article ID, by the number sent in the request", () => {
		const patchVotes = { inc_votes: -5 };
		const expectedUpdatedArticle = {
			article_id: 3,
			title: "Eight pug gifs that remind me of mitch",
			topic: "mitch",
			author: "icellusedkars",
			body: "some gifs",
			created_at: expect.any(String),
			article_img_url:
				"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
			votes: -5,
		};
		return request(app)
			.patch("/api/articles/3")
			.send(patchVotes)
			.expect(200)
			.then(({ body: { updatedArticle } }) => {
				expect(updatedArticle).toEqual(expectedUpdatedArticle);
			});
	});
	it("PATCH 404 - sends an error message when given a valid but non-existent article ID", () => {
		const patchVotes = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/99")
			.send(patchVotes)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Article does not exist");
			});
	});
	it("PATCH 400 - sends an error message when given an invalid article ID", () => {
		const patchVotes = { inc_votes: 1 };
		return request(app)
			.patch("/api/articles/not-an-article")
			.send(patchVotes)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("PATCH 400 - sends an error message when given a valid and existing article ID, but inc_votes is NaN", () => {
		const patchVotes = { inc_votes: "dropdemtables" };
		return request(app)
			.patch("/api/articles/2")
			.send(patchVotes)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("PATCH 400 - sends error message when request does not include inc_votes property ", () => {
		const patchVotes = { test_property: "sup" };
		return request(app)
			.patch("/api/articles/2")
			.send(patchVotes)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});

describe("/api/articles", () => {
	it("GET 200: responds with an articles array of article objects, with the expected properties", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(13);
				articles.forEach((article, index) => {
					expect(article).toEqual({
						author: expect.any(String),
						title: expect.any(String),
						article_id: expect.any(Number),
						topic: expect.any(String),
						created_at: expect.any(String),
						votes: expect.any(Number),
						article_img_url: expect.any(String),
						comment_count: expect.any(Number),
					});
					expect(article.hasOwnProperty("body")).toBe(false);
				});
			});
	});
	it("GET 200: responds with array of articles sorted by date in descending order", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy("created_at", { descending: true });
			});
	});
	it("GET 200: responds with array of articles which have the expected corresponding comment count", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles[0].comment_count).toBe(2);
				expect(articles[1].comment_count).toBe(1);
				expect(articles[2].comment_count).toBe(0);
				expect(articles[6].comment_count).toBe(11);
			});
	});

	it("GET 200: responds with array of articles sorted by date (created_at) by default when no sort_ by query is given (in descending order)", () => {
		return request(app)
			.get("/api/articles?sort_by=")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy("created_at", { descending: true });
			});
	});
	it("GET 200: responds with array of articles sorted by 'title' in descending order when given 'title' as sort_by query", () => {
		return request(app)
			.get("/api/articles?sort_by=title")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy("title", { descending: true });
			});
	});
	it("GET 400: responds with error message when given an invalid sort_by query", () => {
		return request(app)
			.get("/api/articles?sort_by=notAValidColumnName")
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Invalid sort by query");
			});
	});
	it("GET 200: responds with array of articles in descending order by default, when no order query is given", () => {
		return request(app)
			.get("/api/articles?order=")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSorted({ descending: true });
			});
	});
	it("GET 200: responds with array of articles in ascending order by date when given ASC as the order query", () => {
		return request(app)
			.get("/api/articles?order=ASC")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy("created_at", { descending: false });
			});
	});
	it("GET 200: responds with array of articles sorted by 'author' in ascending order, when the queries are sort_by=author and order=ASC", () => {
		return request(app)
			.get("/api/articles?sort_by=author&order=ASC")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toBeSortedBy("author", { descending: false });
			});
	});
	it("GET 400: responds with error message when given an invalid order query", () => {
		return request(app)
			.get("/api/articles?order=invalidOrderQuery")
			.expect(400)
			.then(({ body: { msg } }) => {
				expect(msg).toBe("Invalid order query");
			});
	});
	it("GET 200: responds with an array of articles that match the given topic query", () => {
		return request(app)
			.get("/api/articles?topic=cats")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles.length).toBe(1);
				articles.forEach((article) => {
					expect(article.topic).toBe("cats");
				});
			});
	});
	it("GET 200: responds with an empty array when topic exists but there are no articles", () => {
		return request(app)
			.get("/api/articles?topic=paper")
			.expect(200)
			.then(({ body: { articles } }) => {
				expect(articles).toEqual([]);
			});
	});
});
it("GET 404: responds with error message when the topic does not exist in the DB yest", () => {
	return request(app)
		.get("/api/articles?topic=sillysausages")
		.expect(404)
		.then(({ body: { msg } }) => {
			expect(msg).toBe("Topic not found");
		});
});
it("GET 404: responds with error if SQL injection is attempted", () => {
	return request(app)
		.get("/api/articles?topic=cats;DROP ALL TABLES;")
		.expect(404)
		.then(({ body: { msg } }) => {
			expect(msg).toBe("Topic not found");
		});
});

describe("/api/articles/:article_id/comments", () => {
	it("GET 200: responds with all comments that correspond to the given article ID'", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments.length).toBe(2);
				comments.forEach((comment) => {
					expect(comment.article_id).toBe(3);
				});
			});
	});
	it("GET 200: comments contain the expected properties", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				comments.forEach((comment) => {
					expect(comment).toEqual({
						comment_id: expect.any(Number),
						votes: expect.any(Number),
						created_at: expect.any(String),
						author: expect.any(String),
						body: expect.any(String),
						article_id: 3,
					});
				});
			});
	});
	it("GET 200: responds with most recent comments first (i.e. descending date order)", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toBeSortedBy("created_at", { descending: true });
			});
	});
	it("GET 200: responds with an empty array when an existing article ID is used, but there are no comments associated with that article yet", () => {
		return request(app)
			.get("/api/articles/2/comments")
			.expect(200)
			.then(({ body: { comments } }) => {
				expect(comments).toEqual([]);
			});
	});
	it("GET 404 - sends 404 status and an error message when given a valid but non-existent article ID", () => {
		return request(app)
			.get("/api/articles/999/comments")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Article does not exist");
			});
	});
	it("GET 400 - sends 400 status and an error message when given an invalid article ID", () => {
		return request(app)
			.get("/api/articles/not-an-article/comments")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
	it("POST 201 - inserts new comment into the db and responds with the posted comment object (including corresponding article ID)", () => {
		const testCommentInput = {
			username: "icellusedkars",
			body: "test comment over herrrrrre!",
		};
		const expectedCommentResponse = {
			comment_id: 19,
			votes: 0,
			created_at: expect.any(String),
			author: "icellusedkars",
			body: "test comment over herrrrrre!",
			article_id: 1,
		};
		return request(app)
			.post("/api/articles/1/comments")
			.send(testCommentInput)
			.expect(201)
			.then(({ body }) => {
				expect(body.comment).toEqual(expectedCommentResponse);
			});
	});

	it("POST 404 - responds with error message when given a valid but non-existent article ID", () => {
		const testCommentInput = {
			username: "icellusedkars",
			body: "test comment",
		};
		return request(app)
			.post("/api/articles/999/comments")
			.send(testCommentInput)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Article does not exist");
			});
	});

	it("POST 400 - responds with an error message when given an invalid article ID", () => {
		const testCommentInput = {
			username: "icellusedkars",
			body: "test comment",
		};
		return request(app)
			.post("/api/articles/not-an-article/comments")
			.send(testCommentInput)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});

	it("POST 404 - responds with error message when given a non-existent username", () => {
		const testCommentInput = {
			username: "thisIsNotAnActualUsername",
			body: "test comment",
		};
		return request(app)
			.post("/api/articles/3/comments")
			.send(testCommentInput)
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Username does not exist");
			});
	});

	it("POST 400 - responds with an error message when the username field is empty", () => {
		const testCommentInput = {
			username: "",
			body: "test comment",
		};
		return request(app)
			.post("/api/articles/3/comments")
			.send(testCommentInput)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Username is empty");
			});
	});

	it("POST 400 - responds with an error message when the comment body is empty", () => {
		const testCommentInput = {
			username: "icellusedkars",
			body: "",
		};
		return request(app)
			.post("/api/articles/3/comments")
			.send(testCommentInput)
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Comment field is empty");
			});
	});
});

describe("/api/comments/:comment_id", () => {
	it("DELETE 204 - deletes comment and responds with 204 when given a valid and existing comment ID", () => {
		checkCommentExists(2).then((boolean) => {
			expect(boolean).toBe(true);
		});
		return request(app)
			.delete("/api/comments/2")
			.expect(204)
			.then(() => {
				return checkCommentExists(2).then((boolean) => {
					expect(boolean).toBe(false);
				});
			});
	});
	it("DELETE 404 - responds with an error message when given a valid but non-existent comment ID", () => {
		return request(app)
			.delete("/api/comments/999")
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe("Comment does not exist");
			});
	});
	it("DELETE 400 - responds with an error message when given an invlaid comment ID", () => {
		return request(app)
			.delete("/api/comments/not-a-comment")
			.expect(400)
			.then(({ body }) => {
				expect(body.msg).toBe("Bad request");
			});
	});
});

describe("/api/users", () => {
	it("GET 200 - responds with an array of user objects with the properties username, name and avatar_url", () => {
		return request(app)
			.get("/api/users")
			.expect(200)
			.then(({ body: { users } }) => {
				expect(Array.isArray(users)).toBe(true);
				expect(users.length).toBe(4);
				users.forEach((user) => {
					expect(user).toEqual({
						username: expect.any(String),
						name: expect.any(String),
						avatar_url: expect.any(String),
					});
				});
			});
	});
});
