const download =async (ctx)=>{
    const {name, fileType} = ctx;
    const fileName = file+'.zip';
    ctx.attachment(fileName);
}
module.exports = {
    download
}