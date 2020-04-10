const connectPipeline = require("../model/pipeline");
const getTotalLength = async (ctx) => {
    
    let sql = `select row_to_json(t) from 
(select 'pc' as datatype, * from pc.gettotalpclength union 
select 'wt' as datatype, * from gettotalwtlength union 
select 'xm' as datatype,* from xm.gettotalxmlength) t`
    const res = await connectPipeline(sql);
    const result = res.map(item => item.row_to_json)
    ctx.status = 200;
    ctx.body = {
        info: "长度统计完成",
        data: result
    }

}

const getChartInitData = async (ctx) => {
    const { geom, dataType } = ctx.query;
    let result = {
        pc: {},
        wt: {},
        xm: {}

    };
    if (geom) {
        //自定义区域
        let pc_zy_sql = `SELECT gxdl AS name,sum(length) AS sum FROM pc.puchaline
        where ST_Intersects(ST_GeomFromText('${geom}',4326),geom) GROUP BY name`;
        let pc_ly_sql = `SELECT ly AS name,sum(length) AS sum FROM pc.puchaline
        where ST_Intersects(ST_GeomFromText('${geom}',4326),geom) GROUP BY name`;
        let wt_zy_sql = `SELECT gxdl AS name,sum(length) AS sum FROM prospectlinegcj
        where ST_Intersects(ST_GeomFromText('${geom}',4326),geom) GROUP BY name`;
        let wt_ly_sql = `SELECT ly AS name,sum(length) AS sum FROM prospectlinegcj
        where ST_Intersects(ST_GeomFromText('${geom}',4326),geom) GROUP BY name`;
        let xm_count_sql = `SELECT gxdl AS name,COUNT(DISTINCT xmbm) AS count FROM xm.xmline
        where ST_Intersects(ST_GeomFromText('${geom}',4326),geom) GROUP BY name`;
        let xm_length_sql = `SELECT gxdl AS name,sum(length) AS sum FROM xm.xmline
        where ST_Intersects(ST_GeomFromText('${geom}',4326),geom) GROUP BY name`;
        if (dataType === 'all') {
            //普查专业
            const pc_zy_res = await connectPipeline(pc_zy_sql);
            result.pc.zy = pc_zy_res;
            //普查来源
            const pc_ly_res = await connectPipeline(pc_ly_sql);
            result.pc.ly = pc_ly_res;


            //物探专业
            const wt_zy_res = await connectPipeline(wt_zy_sql);
            result.wt.zy = wt_zy_res;
            //物探来源
            const wt_ly_res = await connectPipeline(wt_ly_sql);
            result.wt.ly = wt_ly_res;


            //规划-项目数量
            const xm_count_res = await connectPipeline(xm_count_sql);
            
            result.xm.zycount = xm_count_res;
            //规划-项目长度
            const xm_length_res = await connectPipeline(xm_length_sql);
            result.xm.zylength = xm_length_res;

        }
        else {
            switch (dataType) {
                case 'pc':
                    //普查专业
                    const pc_zy_res = await connectPipeline(pc_zy_sql);
                    result.pc.zy = pc_zy_res;
                    //普查来源
                    const pc_ly_res = await connectPipeline(pc_ly_sql);
                    result.pc.ly = pc_ly_res;
                    break;
                case 'wt':
                    //物探专业
                    const wt_zy_res = await connectPipeline(wt_zy_sql);
                    result.pc.zy = wt_zy_res;
                    //物探来源
                    const wt_ly_res = await connectPipeline(wt_ly_sql);
                    result.pc.ly = wt_ly_res;
                    break;
                case 'xm':
                    //规划-项目数量
                    const xm_count_res = await connectPipeline(xm_count_sql);
                    result.xm.zycount = xm_count_res;
                    //规划-项目长度
                    const xm_length_res = await connectPipeline(xm_length_sql);
                    result.xm.zylength = xm_length_res;
                    break;
                default:
                    break;

            }

        }


    } else {

        //没有自定义区域，此时dataType肯定是all

        //普查专业
        let pc_zy_sql = `select * from pc.getpclengthbyzy where name is not null`;
        const pc_zy_res = await connectPipeline(pc_zy_sql);
        result.pc.zy = pc_zy_res;
        //普查来源
        let pc_ly_sql = `select * from pc.getpclengthbyly where name is not null`;
        const pc_ly_res = await connectPipeline(pc_ly_sql);
        result.pc.ly = pc_ly_res;


        //物探专业
        let wt_zy_sql = `select * from getwtlengthbyzy where name is not null`;
        const wt_zy_res = await connectPipeline(wt_zy_sql);
        result.wt.zy = wt_zy_res;
        //物探来源
        let wt_ly_sql = `select * from getwtlengthbyly where name is not null`;
        const wt_ly_res = await connectPipeline(wt_ly_sql);
        result.wt.ly = wt_ly_res;


        //规划-项目数量
        let xm_count_sql = `select * from xm.getxmcountbyzy where name is not null`;
        const xm_count_res = await connectPipeline(xm_count_sql);
        result.xm.zycount = xm_count_res;
        //规划-项目长度
        let xm_length_sql = `select * from xm.getxmlengthbyzy where name is not null`;
        const xm_length_res = await connectPipeline(xm_length_sql);
        result.xm.zylength = xm_length_res;


    }
    ctx.body = {
        info: "查询完成",
        data: result
    }

}
module.exports = { getTotalLength, getChartInitData }