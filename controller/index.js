const path = require('path');
const fs = require('fs-extra');
const addFileInfo = (fileType,preXmInfoList) => {
    let filePath = path.resolve(__dirname,'..','files',fileType);
    let newXmInfo = preXmInfoList.map(xminfo=>{
        let file = filePath+'/'+xminfo.xmbh+'.zip';
        console.log(file);
        xminfo.hasFile = fs.pathExistsSync(file)? true: false
        return xminfo
    })
    return newXmInfo
}
console.log(addFileInfo('snsc',[{id:'1',xmbh:'2017-002'},{id:'1',xmbh:'2019-000'}]));