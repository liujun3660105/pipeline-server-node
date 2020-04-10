module.exports = async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    // ctx.set('Access-Control-Allow-Credentials',true);
    if (ctx.method.toUpperCase() == "OPTIONS") {
        ctx.set('Access-Control-Allow-Methods', 'OPTIONS,POST,GET');
        ctx.set('Access-Control-Allow-Headers', 'x-requested-with, accept, origin, content-type, token, Authorization');
        console.log('触发options请求');
        //当为预检请求时，直接返回204，代表空响应体
        ctx.status = 204;
        ctx.body = '';
    } else {
        //当为非预检请求时，直接进入下一个中间件
        await next();
    }

}