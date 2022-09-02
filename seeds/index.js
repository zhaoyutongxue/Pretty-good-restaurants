// this is the js file to seed our database for testing purpose.
const express = require('express')
const mongoose = require('mongoose');
const path = require('path')
const port = 3000
const Campground = require('../models/campground.js')

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers')


mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected")
})

// randomly access data from array, and save it to sample.
// const sample = array=>
//     array[Math.floor((Math.random)* array.length)]

const sample = array => array[Math.floor(Math.random() * array.length)];


// delete everything in the seed database, then save c. 
const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({title:'purple fields'})
    // await c.save();
    for (let i = 0; i < 10; i++) {
        const ram1000 = Math.round(Math.random() * 10);
        const price = Math.floor(Math.random() * 10)
        const c = new Campground({
            author: '62be3dab046c02121fec22cb',
            geometry: { type: 'Point', coordinates: [cities[ram1000].longitude, cities[ram1000].latitude] },
            location: `${cities[ram1000].city}, ${cities[ram1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dcc4gmbgx/image/upload/v1657000365/YelpCamp/htwlqr71qak7lphzsnoa.jpg',
                    filename: 'YelpCamp/htwlqr71qak7lphzsnoa'
                },
                {
                    url: 'https://res.cloudinary.com/dcc4gmbgx/image/upload/v1656940781/YelpCamp/anhwwetdf2utf2yol65s.jpg',
                    filename: 'YelpCamp/anhwwetdf2utf2yol65s'
                }
            ],
            description: 'just typing something',
            price: price

        })
        await c.save();
    }

}


seedDB().then(console.log('seed data written')).then(() => {
    mongoose.connection.close();
});

