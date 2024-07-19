const apiRouter = require("express").Router();
const endpointsData = require("../../endpoints.json");
const topicsRouter = require("./topics-router.js");
const usersRouter = require("./users-router.js");
const articlesRouter = require("./articles-router.js");
const commentsRouter = require("./comments-router.js");

apiRouter.get("/", (req, res, next) => {
	res.status(200).send({ endpoints: endpointsData });
});
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
