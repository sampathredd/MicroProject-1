var express=require('express');
var app=express();
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
const MongoClient=require('mongodb').MongoClient;
let server=require('./server');
let config=require('./config');
let middleware=require('./middleware');
const response=require('express');
const url='mongodb://127.0.0.1:27017';
const dbName='HospitalManagement';
let db
MongoClient.connect(url,{useUnifiedToology:true},(err,client)=>{
    if(err) return console.log(err);
    db=client.db(dbName);
});

//hospital details
app.get("/hospitalsdetails",middleware.checkToken,function(req,res){
    var data = db.collection('hospital').find().toArray()
         .then(result => res.send(result));
});

//ventilator details
app.get("/ventilatordetails",middleware.checkToken,function(req,res){
    var data = db.collection('ventilators').find().toArray()
         .then(result => res.send(result));
});

//Search ventilator by status
app.post('/searchventilatorbystatus',middleware.checkToken,(req,res)=>{
    var status=req.body.status;
    console.log(status);
    var ventilatordetails=db.collection('ventilators')
    .find({"status":status}).toArray().then(result=>res.json(result));
});

//Search ventilator by name
app.post('/searchventilatorbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var ventilatordetails=db.collection('ventilators')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//Search hospital
app.post('/searchhospitalbyname',middleware.checkToken,(req,res)=>{
    var name=req.query.name;
    console.log(name);
    var hospitaldetails=db.collection('hospital')
    .find({'name':new RegExp(name,'i')}).toArray().then(result=>res.json(result));
});

//Update ventilator 
app.put('/updateventilator',middleware.checkToken,(req,res)=>{
    var ventid={ventilatorId:req.body.ventilatorId};
    console.log(ventid);
    var newvalues={$set:{status:req.body.status}};
    db.collection("ventilators").update(ventid,newvalues,function(err,result){
        res.json('1 document updated');
        if(err)throw err;
    });
});

//Add ventilator
app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var hid=req.body.hId;
    var ventilatorId=req.body.ventilatorId;
    var status=req.body.status;
    var name=req.body.name;
    var item={hid:hid,ventilatorId:ventilatorId,status:status,name:name};
    db.collection('ventilators').insertOne(item,function(err,result){
        res.json('Item inserted');
    });
});

//Delete ventilator
app.delete('/delete',middleware.checkToken,(req,res)=>{
    var myquery=req.query.ventilatorId;
    console.log(myquery);
    var myquery1={ventilatorId:myquery};
    db.collection('ventilators').deleteOne(myquery1,function(err,obj){
        if(err)throw err;
        res.json("1 document deleted");
    });
});
app.listen(8080);