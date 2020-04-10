const {login, getUserInfo, verifyToken} = require("../controller/user");
const Router = require("koa-router");
const router = new Router();
router.post('/login',login);
router.get('/getUserInfo',getUserInfo);
router.get('/verifyToken',verifyToken);
module.exports = router.routes();