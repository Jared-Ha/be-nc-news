const {
	convertTimestampToDate,
	createRef,
	formatComments,
} = require("../db/seeds/utils");
const { checkArticleExists } = require("../db/utils/check-article-exists");
const connection = require("../db/connection.js");
const { checkCommentExists } = require("../db/utils/check-comment-exists.js");

afterAll(() => {
	return connection.end();
});

describe("checkCommentExists", () => {
	it("returns true if comment exists", () => {
		checkCommentExists(1).then((boolean) => {
			expect(boolean).toBe(true);
		});
	});
	it("returns false if comment does not exist", () => {
		checkCommentExists(999).then((boolean) => {
			expect(boolean).toBe(false);
		});
	});
	it("returns invalid input syntax SQL error if comment ID is invalid", () => {
		checkCommentExists("hello").then((err) => {
			expect(err.code).toBe("22P02");
		});
	});
});

describe("checkArticleExists", () => {
	it("returns true if article exists", () => {
		checkArticleExists(1).then((boolean) => {
			expect(boolean).toBe(true);
		});
	});
	it("returns false if article does not exist", () => {
		checkArticleExists(25).then((boolean) => {
			expect(boolean).toBe(false);
		});
	});
});

describe("convertTimestampToDate", () => {
	test("returns a new object", () => {
		const timestamp = 1557572706232;
		const input = { created_at: timestamp };
		const result = convertTimestampToDate(input);
		expect(result).not.toBe(input);
		expect(result).toBeObject();
	});
	test("converts a created_at property to a date", () => {
		const timestamp = 1557572706232;
		const input = { created_at: timestamp };
		const result = convertTimestampToDate(input);
		expect(result.created_at).toBeDate();
		expect(result.created_at).toEqual(new Date(timestamp));
	});
	test("does not mutate the input", () => {
		const timestamp = 1557572706232;
		const input = { created_at: timestamp };
		convertTimestampToDate(input);
		const control = { created_at: timestamp };
		expect(input).toEqual(control);
	});
	test("ignores includes any other key-value-pairs in returned object", () => {
		const input = { created_at: 0, key1: true, key2: 1 };
		const result = convertTimestampToDate(input);
		expect(result.key1).toBe(true);
		expect(result.key2).toBe(1);
	});
	test("returns unchanged object if no created_at property", () => {
		const input = { key: "value" };
		const result = convertTimestampToDate(input);
		const expected = { key: "value" };
		expect(result).toEqual(expected);
	});
});

describe("createRef", () => {
	test("returns an empty object, when passed an empty array", () => {
		const input = [];
		const actual = createRef(input);
		const expected = {};
		expect(actual).toEqual(expected);
	});
	test("returns a reference object when passed an array with a single items", () => {
		const input = [{ title: "title1", article_id: 1, name: "name1" }];
		let actual = createRef(input, "title", "article_id");
		let expected = { title1: 1 };
		expect(actual).toEqual(expected);
		actual = createRef(input, "name", "title");
		expected = { name1: "title1" };
		expect(actual).toEqual(expected);
	});
	test("returns a reference object when passed an array with many items", () => {
		const input = [
			{ title: "title1", article_id: 1 },
			{ title: "title2", article_id: 2 },
			{ title: "title3", article_id: 3 },
		];
		const actual = createRef(input, "title", "article_id");
		const expected = { title1: 1, title2: 2, title3: 3 };
		expect(actual).toEqual(expected);
	});
	test("does not mutate the input", () => {
		const input = [{ title: "title1", article_id: 1 }];
		const control = [{ title: "title1", article_id: 1 }];
		createRef(input);
		expect(input).toEqual(control);
	});
});

describe("formatComments", () => {
	test("returns an empty array, if passed an empty array", () => {
		const comments = [];
		expect(formatComments(comments, {})).toEqual([]);
		expect(formatComments(comments, {})).not.toBe(comments);
	});
	test("converts created_by key to author", () => {
		const comments = [{ created_by: "ant" }, { created_by: "bee" }];
		const formattedComments = formatComments(comments, {});
		expect(formattedComments[0].author).toEqual("ant");
		expect(formattedComments[0].created_by).toBe(undefined);
		expect(formattedComments[1].author).toEqual("bee");
		expect(formattedComments[1].created_by).toBe(undefined);
	});
	test("replaces belongs_to value with appropriate id when passed a reference object", () => {
		const comments = [{ belongs_to: "title1" }, { belongs_to: "title2" }];
		const ref = { title1: 1, title2: 2 };
		const formattedComments = formatComments(comments, ref);
		expect(formattedComments[0].article_id).toBe(1);
		expect(formattedComments[1].article_id).toBe(2);
	});
	test("converts created_at timestamp to a date", () => {
		const timestamp = Date.now();
		const comments = [{ created_at: timestamp }];
		const formattedComments = formatComments(comments, {});
		expect(formattedComments[0].created_at).toEqual(new Date(timestamp));
	});
});
