const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var path = require('path')

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/yelp_camp", { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.set('useUnifiedTopology', true);
var Restaurant = require('./models/restaurants')
var Comment = require('./models/comment')

//====================
// WebAuthentication
//=====================
var passport = require('passport')
var LocalStrategy = require('passport-local')
var User = require('./models/user')


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname+'/public'))

//========================================
// Passport Authentication Configuration
//========================================
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
 });

// Routes begins here:
var restaurantRoutes = require("./routes/restaurant")
var indexRoutes = require('./routes/index')

app.use('/listpage', restaurantRoutes)
app.use(indexRoutes)

const port  = 4000;

// var camp = {name:"Red Rose", 
// image:"https://pixabay.com/get/50e9d542485ab108f5d084609620367d1c3ed9e04e507441762a7dd09548cc_340.jpg",
// description: "Top 10 brunch reastaurants in the bay area"
// }

// Restaurant.create(camp, (err,camp)=>{
//     if(err){
//         console.log(err)
//         console.log("the data can't be saved")
//     }else{
//         console.log(camp+"has been successfuly saved!")
//     }
// })

// var camps = [{name:"yellowstone", image:"https://i0.wp.com/www.devilslakewisconsin.com/wp-content/uploads/2018/12/campingheader-small.jpg?fit=750%2C307&ssl=1" },
//     {name:"salmoncreek", image:"https://www.reserveamerica.com/webphotos/racms/articles/images/fef91bb3-1dff-444d-b0e5-d14db129ce1d_image2_3-penn-new.jpg"},
//     {name:"capitalrock", image:"https://cdn.britannica.com/75/93575-050-8ADFBBE0/fishing-Camping-activities-canoeing-Minnesota-Boundary-Waters.jpg"}]

app.set("view engine","ejs" )

app.listen(port, () => {
    console.log("yelpcamp server is started!"
    )
})












