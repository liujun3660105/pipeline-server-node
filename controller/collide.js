const shapefile = require("shp-stream");
const fse = require("fs-extra");
const path = require("path");
const connectPipeline = require("../model/pipeline");

const verifyBox = (bbox, coorType) => {
    let coorBox = [];
    switch (coorType) {
        case 'TJ90':
            coorBox = [94880, 236234, 175000, 323828];
            break;
        case 'CGCS2000':
            coorBox = [503969, 4268822, 591802, 4356088];
            break;
        default:
            coorBox = [114, 38.53, 120, 40.14];
            break;
    }
    if (bbox[0] < coorBox[0] || bbox[1] < coorBox[1] || bbox[2] > coorBox[2] || bbox[3] > coorBox[3]) {
        return false;
    }
    return true;

}

const readShpFile = (targetPath) => {
    return new Promise((resolve, reject) => {
        shapefile.read(targetPath, { encoding: "UTF-8", "ignore-properties": true }, (err, collection) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(collection);
            }

        })
    })
}

//将Geojson  Feautures=》geometries
//sql语句ST_GeomFromGeoJSON只接受type:"GeomCollection"，不接受type:"FeatureCollection"
const toGeoCollection = (geojson) => {
    let geometryCollection = { type: "GeometryCollection", geometries: [] };
    geojson.features.map(feature => {
        geometryCollection.geometries.push(feature.geometry);
    })
    return geometryCollection
}

const getUploadGeometry = async (ctx) => {
    let results = "";
    let info = "";
    const { coortype } = ctx.request.body;
    const file = ctx.request.files.file;
    const targetPath = path.resolve(__dirname, "../public", file.name);
    try {
        await fse.move(file.path, targetPath);
    } catch (error) {
        ctx.status = 402;
        info = "上传失败";
        results = "failed";
    }
    try {
        var collection = await readShpFile(targetPath);
        await fse.emptyDir(path.resolve(__dirname, "../public"));
    } catch (error) {
        ctx.status = 401;
        info = "读取shp文件出错";
        results = "failed";
    }
    const geometryType = collection.features[0].geometry.type;
    const bbox = collection.bbox;
    if (geometryType != 'LineString') {
        info = "数据类型有误";
        results = "failed";
        ctx.status = 201;
    }
    else {
        //去除bbox属性
        let { bbox, ...geojson } = collection;

        //范围校验
        if (verifyBox(bbox, coortype)) {
            ctx.status = 200;
            info = "上传成功";
            if (coortype === 'GCJ-02') {
                //当是火星坐标系时，不需要进行转换  FeatureCollection
                results = geojson;
            }
            else {
                let geometryCollection = toGeoCollection(geojson)
                let geometryCollectionStr = JSON.stringify(geometryCollection);
                let sql = `select GIS_Coordinate_Transform('${geometryCollectionStr}','${coortype}','4326','LINESTRING')`;
                const res = await connectPipeline(sql);
                
                let resultGeometryCollection = toGeoCollection(JSON.parse(res[0].gis_coordinate_transform));
                results = resultGeometryCollection;

            }
        }
        else {
            info = "数据超出坐标范围";
            results = "failed";
            ctx.status = 202
        }

    }
    ctx.body = {
        info: info,
        data: results
    }

    // shapefile.read(path.resolve(__dirname,"../tempFile/line-test.shp"),{encoding:"UTF-8","ignore-properties":true},(err,collection)=>{


}
const getAnalyzeGeometry = async (ctx) => {
    const { uploadGeoJsonStr, zy, gj, ylz, msfs, gjvalue } = ctx.query;
    let uploadGeom = ''
    //判断是geometryCollection 还是FeatureCollection  这里只有转换成GeometryCollection才可以  火星坐标系在这里是FeatureCollection
    //其它坐标系是GeometryCollection
    if(JSON.parse(uploadGeoJsonStr).type==='FeatureCollection'){
        uploadGeom =JSON.stringify(toGeoCollection(JSON.parse(uploadGeoJsonStr)));
    }else{
        uploadGeom = uploadGeoJsonStr
    }
    let sql = `select buffer_filter_byinputline('${uploadGeom}','public','prospectlinegcj','${zy}','${gj}','${ylz}','${msfs}','${gjvalue}')`;
    const res = await connectPipeline(sql);
    const results = res[0].buffer_filter_byinputline;
    ctx.status = 200;
    ctx.body = {
        info: "分析完成",
        data: results
    };
}
module.exports = { getUploadGeometry, getAnalyzeGeometry }