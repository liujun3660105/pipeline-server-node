const error =async (ctx,next)=>{
    try {
        await next();
    } catch (error) {
        console.log('error',error)
    }
}
module.exports = error;   