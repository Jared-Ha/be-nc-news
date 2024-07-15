const request = require("supertest");
const app = require("../db/app.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");
const connection = require("../db/connection.js");

beforeAll(() => {
	return seed(testData);
});

afterAll(() => {
	return connection.end();
});

describe("GET /api/topics", () => {
	it("rGET 200 - responds with an array of topic objects with the properties 'slug' and 'description'", () => {
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
