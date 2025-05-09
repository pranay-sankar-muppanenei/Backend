const express=require("express");
const path=require("path");
const cors=require("cors");
const bcrypt = require("bcrypt");

const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const app=express();
app.use(cors({
    origin: 'http://localhost:3000', // allow your frontend origin
    methods: ['GET', 'POST'],
    credentials: true,
  }));
app.use(express.json());

const dbPath=path.join(__dirname,"profile.db");

let db=null;

const init=async ()=>{
    try{
    db=await open({
        filename:dbPath,
        driver:sqlite3.Database,
    });
    app.listen(3001,()=>{
        console.log("server running at 3000");
    })}
    catch(e){
        console.log(`DB ERROR: ${e.message}`);
        process.exit(1);
    }
};

init();

app.get('/',async (request,response)=>{
    const query=`select *from author;`;
    const array=await db.all(query);
    response.send(array);
});
app.post("/user/",async(request,response)=>{
    const {username,password}=request.body;
    const hash=await bcrypt.has(password,10);
    const q = `SELECT * FROM user WHERE username='${username}'`;
    const dbuser=await db.get(q);
    if(dbuser==undefined){
        const query="insert into user(username,password) values ('${username}','${hash}')";
        const response=await db.run(query);
        response.send('created new user');
    }
    else{
        response.send("user already exits");
    }
})
