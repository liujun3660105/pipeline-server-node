const {getTotalLength, getChartInitData} = require("../controller/statistic");
const Router = require("koa-router");
const router = new Router();
router.get('/getTotalLength',getTotalLength);
router.get('/getChartInitData',getChartInitData);
module.exports = router.routes();