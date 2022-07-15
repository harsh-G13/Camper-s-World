const express = require('express');
const mongoose = require('mongoose')
const app = express();
const path = require('path');
const cities = require('./cities')
const { descriptors, places } = require('./seedHelpers')
const Campground = require('../models/campground')



mongoose.connect('mongodb://localhost:27017/yelp-camp');
const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected")
})
const sample = ar => ar[Math.floor(Math.random() * ar.length)]
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const rand = Math.floor(Math.random() * 1000)
        const camp = new Campground({
            author: '61a05cff045fe8dcc781179f',
            location: `${cities[rand].city},${cities[rand].state}`,
            geometry: { type: 'Point', coordinates: [ 72.83333, 18.96667 ] },
            title: `${sample(descriptors)} ${sample(places)}`,
            geometry:{
                type:"Point",
                coordinates:[
                    cities[rand].longitude,
                    cities[rand].latitude
                ]
            },
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem neque maxime eum minus obcaecati, nemo accusamus dolorum quia iste iusto mollitia libero odio repellendus. Optio inventore vel obcaecati adipisci culpa?',
            price: Math.floor(Math.random() * 20) + 10,
            images: [
                { "url": "https://res.cloudinary.com/docup1g2k/image/upload/v1638590539//kuap5in0jb31hjt442k9.jpg", "filename": "YelpCamp/kuap5in0jb31hjt442k9.jpg" }
        
            ]
        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
});