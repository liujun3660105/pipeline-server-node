const {getPolygon} = require("../controller/distance");

const Router = require("koa-router");
const router = new Router();
router.get("/getPolygon", getPolygon);
module.exports = router.routes();