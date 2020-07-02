const {download} = require('../controller/download');
const Router = require('koa-router');
const router = new Router();
router.get('/download',download);
module.exports = router.routes();