const connectPipeline = require("../model/pipeline");
const {token_secret} = require("../config");
const jwt = require("jsonwebtoken");
const login = async (ctx)=>{
    const {username,password} = ctx.request.body;
    let sql = `select username from login.userinfo where username='${username}' and password='${password}'`
    let user = await connectPipeline(sql);
    if(user.length>0){
        let username = user[0].username;
        ctx.status = 200;
        ctx.body={
            info:'登陆成功',
            user:username,
            token:jwt.sign(
                {
                    data:username,
                    exp:Math.floor(Date.now()/1000) + 60*60
                },
                token_secret
            )
        }

    }
    else{
        sql = `select userName from login.userinfo where username = '${username}'`;
        user = await connectPipeline(sql);
        if(user.length>0){
            ctx.status=201;
            ctx.body="登陆失败，密码错误";
        }
        else{
            ctx.status=202;
            ctx.body="登陆失败，用户名不存在";
        }
    }
}
const getUserInfo = async (ctx)=>{
    //通过传过来的token，解析出username，通过username，查找用户角色role
    const userName = ctx.state.user.data || "";
    let sql = `select role from login.userinfo where username = '${userName}'`;
    let user = await connectPipeline(sql);
    if(user.length>0){
        const role = user[0].role;
        ctx.status=200;
        ctx.body={
            info:"获取用户信息成功",
            data:{
                access:role,
                userName
            }
        }
    }
    else{
        ctx.status=202;
        ctx.body={
            info:"token失效",
            data:{
            }
        }
    }
}
const verifyToken = async (ctx)=>{
    ctx.status = 200;
    ctx.body={
        info:"验证成功",
        data:""
    }
}
module.exports = {login, getUserInfo,verifyToken}