// const fse = require("fs-extra");
// const fs = require("fs");
// const path = require('path');
// const destFilePath = path.resolve(__dirname, '..', 'public');
const axios = require('axios');
const uploadFile = async (ctx) => {
    const { features } = ctx.request.body;
    const geoJSON = JSON.parse(features);
    const random = parseInt(Math.random() * 100000000);
    // try {
    //     await fse.writeJSON(destFilePath + `/${random}.json`, geoJSON);
    // } catch (error) {
    //     console.log(error);
    // }
    // const formdata = new FormData();
    // let file = fs.createReadStream(destFilePath+`/${random}.json`);
    // formdata.append('file',file);
    const ret = await axios.post('http://192.168.1.225:8083/fmerest/v3/resources/connections/FME_SHAREDRESOURCE_TEMP/filesys/upload/geojson?createDirectories=true&overwrite=true',
        geoJSON
    ,{
        headers:{
            'Authorization': 'fmetoken token = 07bf2350b5a9a02e282e3b31d7b0a378c7fd4dcb',
            'Accept': 'application/json',
            'Content-Disposition': 'attachment; filename='+`${random}.json`,
            'Content-Type':'application/octet-stream'
        }
    });
    const {path,name} = ret.data;
    ctx.status = 200;
    ctx.body={
        info:'上传成功',
        data:{
            path,
            name
        }
    }
}
module.exports = {
    uploadFile
}