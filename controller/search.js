
const connectPipeline = require("../model/pipeline");
const path = require('path');
const fs = require('fs-extra');


//判断项目信息中的项目编号 是否有对应的文件
const addFileInfo = (fileType,preXmInfoList) => {
    let filePath = path.resolve(__dirname,'..','files',fileType);
    let newXmInfo = preXmInfoList.map(xminfo=>{
        let file = filePath+'/'+xminfo.xmbh+'.zip';
        xminfo.hasFile = fs.pathExistsSync(file)? true: false
        return xminfo
    })
    return newXmInfo
}





//关键字查询
const getXminfoByKey = async (ctx) => {
    const { keyWord, keyWordType } = ctx.query;
    let filter = keyWord ? `where xmbh like '%${keyWord}%' or xmmc like '%${keyWord}%'` : ""
    let sql = `select row_to_json(xminfo.${keyWordType}.*) from xminfo.${keyWordType} ${filter}`;
    const res = await connectPipeline(sql);
    const result = res.map(item => {
        return item.row_to_json
    });
    //得到新的项目信息
    const newResult = addFileInfo(keyWordType,result)
    ctx.status = 200;
    ctx.body = {
        info: "查询成功",
        data: newResult
    }
}
const getFeatureById = async (ctx) => {
    const { xmIds } = ctx.query;
    let sql = `
select row_to_json(fc) from (
    select 'FeatureCollection' as "type",array_to_json(array_agg(f)) as "features" from (
        select 'Feature' as "type",ST_AsGeoJSON(geom)::json as "geometry",(
            select row_to_json(t) from (
                select gxcl,msfs,gj,dlts,glts,ylz,yyks,gxyjlb,gxyjlbdm,gxdl,gxdldm,xmbm,ly,bz) t) as "properties"
                from xm.xmline where xmbm in (${xmIds})) as f
            ) as fc
    `
    const res = await connectPipeline(sql);
    const geojson = res.map(item => {
        return item.row_to_json
    })
    ctx.status = 200;
    ctx.body = {
        info: "查询成功",
        data: geojson
    }
}


//几何查询
const getIds = (idList) => {
    if(idList.length>0){
        return idList.map(item => {
            let id = item.xmbm;
            return `'${id}'`;
        }).join(',');
    }else{
        return "''"
    }

}


const getFeatureByGeom = async (ctx) => {
    const { drawGeometry, searchType, fieldType } = ctx.query;
    let sql_XmIds = `select distinct(xmbm) from xm.xmline where ly='${searchType}' and ST_Intersects(ST_GeomFromText('${drawGeometry}',4326),geom)`;
    const idList = await connectPipeline(sql_XmIds);
    const ids = getIds(idList);
    let sql_GeoJson = `select row_to_json(fc) from (
        select 'FeatureCollection' as "type",array_to_json(array_agg(f)) as "features" from (
            select 'Feature' as "type",ST_AsGeoJSON(geom)::json as "geometry",(
                select row_to_json(t) from (
                    select gxcl,msfs,gj,dlts,glts,ylz,yyks,gxyjlb,gxyjlbdm,gxdl,gxdldm,xmbm,ly,bz) t) as "properties"
                    from xm.xmline where xmbm in (${ids})) as f
                ) as fc`;
    const geojson = await connectPipeline(sql_GeoJson);
    const geojsonResult = geojson.map(item => {
        return item.row_to_json
    })
    // let sql_xmInfo = `select row_to_json(xminfo.${fieldType}.*) from xminfo.${fieldType} where  xmbm in (${ids})`;
    let sql_xmInfo = `select * from xminfo.${fieldType} where xmbh in (${ids})`;
    const xmInfo = await connectPipeline(sql_xmInfo);
    const newXmInfo = addFileInfo(fieldType,xmInfo);
    ctx.status = 200;
    ctx.body = {
        info:"查询成功",
        data:{
            xmInfo:newXmInfo,
            geojsonResult
        }

    }
}


module.exports = { getXminfoByKey, getFeatureById, getFeatureByGeom }