const {getUploadGeometry, getAnalyzeGeometry} = require("../controller/collide");

const Router = require("koa-router");
const router = new Router();
router.post("/getUploadGeometry",getUploadGeometry);
router.get("/getAnalyzeGeometry", getAnalyzeGeometry);
module.exports = router.routes();