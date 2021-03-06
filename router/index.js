const Router = require("koa-router");
const router = new Router();
// const router = new Router({ prefix: '/api' });
const userRouter = require('./user');
const searchRouter = require('./search');
const statisticRouter = require('./statistic');
const collideRouter = require('./collide');
const distanceRouter = require('./distance');
const exportRouter = require('./export');
const downloadRouter = require('./download');
router.use('/api/user',userRouter);
router.use('/api/search',searchRouter);
router.use('/api/statistic',statisticRouter);
router.use('/api/collide',collideRouter);
router.use('/api/distance',distanceRouter);
router.use('/api/export',exportRouter);
router.use('/api/download',downloadRouter);

module.exports = router;