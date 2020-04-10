const connectPipeline = require("../model/pipeline");
const getPolygon =async (ctx)=>{
    const {drawGeoWkt,zy,gj,ylz,msfs,gjvalue} = ctx.query;
    let info = "";
    let results = "";
    let sql = `select getPolygonsBydrawGeom('${drawGeoWkt}','public','prospectlinegcj','${zy}','${gj}','${ylz}','${msfs}',${gjvalue})`;
    try {
        const res = await connectPipeline(sql);
        results = res[0].getpolygonsbydrawgeom;
        info = "分析成功";
        ctx.status = 200;
        
    } catch (error) {
        ctx.status = 401;
        info = "分析错误"
        results = "";
    }
    ctx.body = {
        info,
        data:results
    }
}
module.exports = {getPolygon}