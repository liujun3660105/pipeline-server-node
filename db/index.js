const {Pool} = require('pg');
let pool = new Pool({
    host:'192.168.1.225',
    port:"5432",
    database:"pipeline",
    user:'postgres',
    password:"bupd",
    max:2000,
    idleTimeoutMillis:30000
})