const jwtAuth = require("koa-jwt");
const { token_secret } = require("../config");
// module.exports = jwtAuth({
//     secret: 'bupd'
// }).unless({
//     path: [/login/]
// });
const authErr = (ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                error: err.originalError ? err.originalError.message : err.message
            };
        } else {
            throw err;
        }
    });
}
module.exports = (app) => {
    app.use(authErr);
    app.use(jwtAuth({
        secret: token_secret
    }).unless({
        //登陆不进行token验证
        path: [/login/]
    }))
}
