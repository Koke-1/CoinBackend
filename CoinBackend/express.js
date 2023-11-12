const express = require("express")
const http = require("http")
const mysql = require("mysql")
const cors = require("cors")
const pass = require("dotenv").config()


const app = express()
const server = http.createServer(app)
// app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host:"database-1.cfip7vy4eklc.us-east-2.rds.amazonaws.com",
    port:"3306",
    user:"admin",
    password:pass.parsed.PASSWORD,
    database:"myCoinDB"    
})


db.connect((err)=>{
    if (err) throw new Error(err);
    console.log("DB Connected ");
    db.query("CREATE DATABASE IF NOT EXISTS coinUsers",(err)=>{
        if (err) throw new Error(err);
        console.log("DB CREATED!");
        createTable()
    })
    
})

function createTable(){
    db.query(`CREATE TABLE IF NOT EXISTS Users (
        userName varchar(255) NOT NULL PRIMARY KEY,
        password varchar(255) NOT NULL ,
        wins Int,
        loses Int
    )`,(err)=>{
        if (err) throw new Error(err);
        console.log("TABLE CREATED");
    })}

app.post("/API",(req,res)=>{
    const {username,password} = req.body
    console.log(username,password);
    db.query(`INSERT IGNORE INTO Users (userName,password,wins,loses) VALUE (?,?,?,?)`,[username,password,0,0],(err,result)=>{
        if (err) throw new Error(err);
        console.log("POSTED!",result);
        res.end()
    }  )
})

app.put("/API",(req,res)=>{
    const {wins,loses,username } = req.body
    console.log(username,loses,wins);
    db.query(`UPDATE Users SET wins = ?, loses = ? WHERE userName = ?`,[wins,loses,username],
    (err,result)=>{
     if (err) throw new Error(err); 
    })
})

app.get("/",(req,res)=>{
    console.log("connected");
})

app.get(`/API`,(req,res)=>{
    const User = req.query.userName
    const Pass = req.query.password
    db.query(`SELECT * FROM Users WHERE userName = ? AND password = ?`,[User,Pass],(err,result)=>{
        if (err) throw new Error(err);
        res.json(result)
    })
})

app.get(`/AllPlayers`,(req,res)=>{
    db.query(`SELECT * FROM Users`,(err,result)=>{
        if (err) throw new Error(err);
        res.json(result)
    })
})

server.listen(3000,()=>{
    console.log("Listening...");
})