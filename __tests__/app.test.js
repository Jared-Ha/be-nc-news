const request = require("supertest");
require("jest-sorted");
const app = require("../db/app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");
const endpointsData = require("../endpoints.json");

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
			.get("/api/articles/2")
			.expect(200)
			.then(({ body: { article } }) => {
				expect(article).toEqual({
					article_id: 2,
					title: "Sony Vaio; or, The Laptop",
					topic: "mitch",
					author: "icellusedkars",
					body: expect.any(String),
					created_at: expect.any(String),
					article_img_url:
						"https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
					votes: 0,
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
				for (let i = 1; i < articles.length; i++) {
					expect(Date.parse(articles[i - 1].created_at)).toBeGreaterThanOrEqual(
						Date.parse(articles[i].created_at)
					);
				}
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
				expect(comments).toBeSorted("created_at", { descending: true });
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
