const {uploadFile, downloadFile} = require("../controller/export");

const Router = require("koa-router");
const router = new Router();
router.post("/uploadFile",uploadFile);
module.exports = router.routes();