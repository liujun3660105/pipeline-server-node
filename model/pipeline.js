const {Pool} = require('pg');
const dbConfig = require("../db/dbConfig");
//数据库需要变化

const pool = new Pool({...dbConfig,database:"pipeline"});
let connectPipeline = async (sql)=>{
    let connection = await pool.connect();
    try {
        let result = await connection.query(sql);
        connection.release()
        return result.rows
    } catch (error) {
        console.log(error)
    }
}
// module.exports = (async function(){
//     console.log(111);
//     const client = await pool.connect();
//     return client
// })()
module.exports = connectPipeline;

