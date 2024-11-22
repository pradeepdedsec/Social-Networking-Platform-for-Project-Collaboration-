const mysql=require("mysql");


const db=mysql.createConnection({
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    host:process.env.DB_HOST,
    port:process.env.DB_PORT,  
    database:process.env.DATABASE
});

db.connect();

module.exports=db
