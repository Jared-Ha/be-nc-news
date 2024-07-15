const request = require("supertest");
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

describe("GET /api", () => {
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

describe("GET /api/topics", () => {
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

describe("GET /api/articles/:article_id", () => {
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

describe("GET /api/articles", () => {
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
