const Koa = require("koa");
const app = new Koa();
app.keys = ['some secret'];
const router = require("./router");
const static = require("koa-static");
const jwtAuth = require("./middleware/token");
// const jwtAuth = require("koa-jwt");
const cors = require('./middleware/cors');
const error = require("./middleware/error");
const koaBody = require("koa-body");
const path = require('path');
// app.use(static(path.join(__dirname , 'files')));
app.use(static('./'));

// app.use(require("koa-bodyparser")());
app.use(koaBody({
    multipart:true//支持文件上传
}));
//除了包含login的route，其他都要进行鉴权
app.use(error);
app.use(cors);
jwtAuth(app);

app.use(router.routes());



app.listen(5000,()=>{
    console.log("服务开启，端口5000")
});