var express  = require("express"),
    app      = express(),
    body     = require("body-parser"),
    mongoose = require("mongoose");
app.use(body.urlencoded({ extended: true }));
var count=0;
//connect mongoose
mongoose.connect('mongodb://localhost:27017/hotel',{ useNewUrlParser: true });
//create schemas
var roomsSchema = new mongoose.Schema({
    room_num:String,
    gender:String
});
var bedinroomsSchema = new mongoose.Schema({
    room_num:String,
    bed_num:String,
    mis_ishi:String,
    full_name:String,
    start_date:String,
    end_data:String
})
//create models we can work on
var Hotelroom = mongoose.model("Hotelroom",roomsSchema);
var BedInRoom = mongoose.model("BedInRoom",bedinroomsSchema);
//create room
/*
Hotelroom.create(
    {
    room_num:"114",
    is_full:false,
    gender:"בנים"
    },function(err,room){
        if(err)
        {
            console.log('@@@@@@@@@@ Error @@@@@@@@');
            console.log(err);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
        else{
            console.log('@@@@@@ Room-Created @@@@@@');
            console.log(room);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
});
*/
//create beds in rooms
/*
BedInRoom.create(
    {
    room_num:"212",
    bed_num:"1",
    mis_ishi:"8369400",
    full_name:"noga peretz",
    start_date:"01/06/2016",
    end_data:"01/01/2019"
    },function(err,room){
        if(err)
        {
            console.log('@@@@@@@@@@ Error @@@@@@@@');
            console.log(err);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
        else{
            console.log('@@@@@@ Room-Created @@@@@@');
            console.log(room);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
});
*/
//Root Route
app.get('/',function(req,res){
    res.render('home.ejs');
});
//Rooms Route
app.get('/rooms',function(req,res){
    var count, rNum, bNum;
    var arrSortRooms = [], i=0,c; //arr to sort the boys and girls room
    var ansArr = [];//arr that contain how much beds taken in every room
    BedInRoom.find({},function(err,allbeds){
     if(err){
         console.log(err);
     }
     else{
         Hotelroom.find({},function(err, allRooms) {
             
             if(err){
                console.log('@@@@@@@@@@ Error @@@@@@@@');
                console.log(err);
                console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
             }
             else{
                //find how much beds open in room and put the answer in arrayy
                allRooms.forEach(function(room){
                    c=setCount(allbeds,room)
                    ansArr.push(c);
                    arrSortRooms.push(room);
                });
                console.log('@@@@@@ Rooms-Rendered @@@@@@');
                arrSortRooms = arrSortRooms.sort(function(a, b){return b.room_num - a.room_num });
                res.render('rooms.ejs',{arrSortRooms:arrSortRooms,ansArr:ansArr});
             }
         });
     }
    });
});
//Room number Route
app.get('/rooms/:rNum',function(req,res){
      BedInRoom.find({room_num:req.params.rNum}, function(err,room)
      {
        var rN = req.params.rNum;// get the room number from the requset
        if(err){
            console.log(err);
        } else{
            console.log("room "+ rN +" Found!");
            res.render('roomNum.ejs',{room:room,rN:rN});
        }
      });
});
//Bed Info in Room Route
app.get('/rooms/:rNum/:bNum',function(req,res){
    var rN = req.params.rNum;
    var bN = req.params.bNum;
    BedInRoom.find({room_num: rN,bed_num: bN},function(err, bed) {
        if(err)
        {
            console.log(err);
        }
        else{
            if(!bed.length)//check if find returned undefined value
            {
                res.render('bedNum.ejs',{bed:bed,rN:rN,bN:bN});
            }
            else
            {
                console.log("Bed "+bN + " was found in room "+rN )
                res.render('bedNum.ejs',{bed:bed,rN:rN,bN:bN});
            }
        }
    });
});
//Create - Add to DB a person info in bed
app.post('/rooms/:rNum/:bNum',function(req,res){
var room =    req.body.roomNum;
var bedN =    req.body.bedNum;
var ishi =    req.body.misIshi;
var fName =    req.body.fullName;
var sDate =    req.body.startDate;
var eDate =    req.body.endDate;
var newBed = {room_num: room,bed_num: bedN, mis_ishi:ishi, full_name:fName, start_date:sDate, end_data:eDate};
BedInRoom.create(newBed,function(err,bed){
        if(err)
        {
            console.log('@@@@@@@@@@ Error @@@@@@@@');
            console.log(err);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
        else{
            console.log('@@@@@@ Bed-Created @@@@@@');
            console.log("bed number "+bed.bed_num +" in room "+bed.room_num);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
});
res.redirect('/rooms/' + room);
});
//Remove - remove beds from DB
app.post('/rooms/:rNum/:bNum/delete',function(req,res){
var bed =     req.params.bNum;
var room =    req.params.rNum;
var delBed =  {room_num:room,bed_num:bed};
BedInRoom.remove(delBed,function(err,bed){
        if(err)
        {
            console.log('@@@@@@@@@@ Error @@@@@@@@');
            console.log(err);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
        else{
            console.log('@@@@@@ BED-REMOVED @@@@@@');
            console.log("bed number "+bed.bed_num +" in room "+bed.room_num);
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@');
        }
});
res.redirect('/rooms/' + room);
});
//Bed Info in Room Route
app.get('/queries',function(req,res){
    res.render('qry.ejs');
});
//get room details by id
app.post('/queries/get',function(req,res){
    var ma = req.body.mis;//represent the id
        BedInRoom.find({mis_ishi:ma},function(err, bed) {
        if(err)
        {
            console.log(err);
        }
        else{
            if(!bed.length)//check if find return undefined value
            {
                console.log("something went wrong the id not exsist");
            }
            else
            {
                var rN = bed[0].room_num;
                var bN = bed[0].bed_num;
                console.log("found bed number "+bN +" in room "+rN);
                res.render('bedNum.ejs',{bed:bed,rN:rN,bN:bN});
            }
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("server is running");
});

/////// functions ////////////////////////////////////////////////////
function setCount(allbeds,room){//count taken beds per room
    count =0;
    allbeds.forEach(function(b){
        if(b.room_num==room.room_num)
        {
            count++
        }
    });
    return room.room_num+","+count;//return the room and the taken beds
}