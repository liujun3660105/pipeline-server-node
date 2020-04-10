const connectPipeline = require("../model/pipeline");
const getFeature = async (ctx)=>{
    const {keyWord, keyWordType} = ctx.query;
    let filter = keyWord? `and xmbm='${keyWord}'`:''
    let sql = `
    select row_to_json(fc) from (
        select 'FeatureCollection' as "type",array_to_json(array_agg(f)) as "features" from (
            select 'Feature' as "type",ST_AsGeoJSON(geom)::json as "geometry",(
                select row_to_json(t) from (
                    select gxcl,msfs,gj,dlts,glts,ylz,yyks,gxyjlb,gxyjlbdm,gxdl,gxdldm,xmbm,ly,bz) t) as "properties"
                    from xm.xmline where ly='${keyWordType}' ${filter}) as f
                ) as fc
        `
    const res = await connectPipeline(sql);
    const result = res.map(item=>{
        return item.row_to_json
    })
    ctx.status = 200;
    ctx.body = {
        info:"查询成功",
        data:result
    }
}


const getXminfo = async (ctx)=>{
    const {keyWord, keyWordType} = ctx.query;
    let filter = keyWord? `where xmbh = ${keyWordType}`:""
    let sql = `select row_to_json(xminfo.${keyWordType}.*) from xminfo.${keyWordType} ${filter}`;
    console.log(sql);
    const res = await connectPipeline(sql);
    const result = res.map(item=>{
        return item.row_to_json
    })
    ctx.status = 200;
    ctx.body = {
        info:"查询成功",
        data:result
    }
}
module.exports = {getXminfo, getFeature}