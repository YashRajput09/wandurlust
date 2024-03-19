const mongoose = require('mongoose');
const initData = require('./data.js');
const Listing = require('../models/listing.js');

async function dbConnection(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    }
    dbConnection().then(()=>{
        console.log("connected with db");
    }).catch((err)=>{
        console.log(err);
    });

    const initDB = async () =>{
        // delete all listings in the database and add new ones
        await  Listing.deleteMany({});
        initData.data = initData.data.map((obj) =>({   //.data  is an array from data.js file which  contains objects of different listings
            ...obj,         // deconstructing the object  
            owner: '65f6c5a6d5fbd6d5faf640bd', // assign a owner to each listing
        }));
        // 'initData' is a  json file that contains 'data' to be added into the database
        await Listing.insertMany(initData.data);
        console.log("data was initialized");
    };

    initDB();