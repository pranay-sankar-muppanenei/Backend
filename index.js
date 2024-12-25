const express=require("express");
const path=require("path");
const cors=require("cors");

const {open}=require("sqlite");
const sqlite3=require("sqlite3");
const app=express();
app.use(cors());
app.use(express.json());

const dbPath=path.join(__dirname,"profile.db");

let db=null;

const init=async ()=>{
    try{
    db=await open({
        filename:dbPath,
        driver:sqlite3.Database,
    });
    app.listen(3000,()=>{
        console.log("server running at 3000");
    })}
    catch(e){
        console.log(`DB ERROR: ${e.message}`);
        process.exit(1);
    }
};

init();

app.get('/',async (request,response)=>{
    const query=`select *from profile;`;
    const array=await db.all(query);
    response.send(array);
});
