const {getFeature, getXminfo} = require("../controller/search");
const Router = require("koa-router");
const router = new Router();
router.get('/getXminfo',getXminfo);
router.get('/getFeature',getFeature);
module.exports = router.routes();