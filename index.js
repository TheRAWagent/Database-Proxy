const mongoose=require('mongoose');
const express=require('express');
const bodyParser=require('body-parser');
const dotenv=require('dotenv');
require('dotenv').config();
const cors=require('cors');
const app=express();

// connect to mongodb

dotenv.config();
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/AIO";


const connectDB=()=>{
    mongoose.connect(`${MONGO_URL}`).then(()=>{
        console.log("Connected to MongoDB");
        
    }).catch((error)=>{
        console.log("Error connecting to MongoDB");
        console.log(error);
    })
}

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    skills: {
        type:Array,
        required:true
    },
    photoUrl: {
        type:String,
        required:true
    },
})

const User=mongoose.model('User',UserSchema);

connectDB();
app.use(bodyParser.json());
app.use(cors());
// routes
app.get('/api/user',(req,res)=>{
    const email=req.query.email;
    User.find({email:email}).then((user)=>{
        if(user.length===0)
        {
            const user=new User({
                email:email,
                name:req.query.name?req.query.name:email.split('@')[0],
                skills:req.query.skills?req.query.skills:[],
                photoUrl:req.query.photoUrl?req.query.photoUrl:"https://i.pinimg.com/originals/77/45/a4/7745a4b9d2ec499547f049b42fb57a9f.jpg"
            })
            user.save().then(()=>{
                res.json({...user._doc});
            })
        }
        else
        {
            console.log(user[0]);
            res.json({...user[0]._doc});
        }

    });
})

app.listen(5000,()=>{
    console.log("Server is running on port 5000");
})