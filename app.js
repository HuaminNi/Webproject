const express = require('express');
const app = express();
var bodyParser = require('body-parser')
var path = require('path')

const mongoose = require('mongoose')
mongoose.connect("mongodb://myUserAdmin:admin123@localhost/yelp_camp?authSource=admin", { useNewUrlParser: true })
mongoose.set('useUnifiedTopology', true);
var Restaurant = require('./models/restaurants')
var Comment = require('./models/comment')

//=====================
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

app.get("/", (req, res) => {
    res.render("landpage")
})


app.get("/listpage", (req, res) => {
    Restaurant.find({},(err,result)=>{
        if(err) {
            console.log(err)
            console.log("Can't not get access to the database")
        }else{
            console.log("the data in database is:")
            console.log(result)
            res.render("listpage", {camps:result})
        }
    })  
})

app.post("/listpage", function(req,res){
    var name = req.body.campname
    var url = req.body.imgurl
    var desc = req.body.description
    var newcamp = {name:name, image:url,description:desc}
    console.log(newcamp)
    camps.push(newcamp)
    res.redirect("/listpage")

})

app.get("/listpage/new", (req, res) => {
    res.render("new")
})

app.get("/listpage/:id", (req, res) => {
    Restaurant.findById(req.params.id).populate("comments").exec(function(err,updateRes){
        if(err) {
            console.log(err);
            console.log("populate wrong")
        }else{
            console.log("updateRes is" + updateRes.comments)
            res.render("show", {findrestaurant:updateRes})
        }
    })
    // Restaurant.findById(req.params.id, (err,result)=>{
    //     if(err){
    //         console.log(err);
    //         console.log("The id is not existes")
    //     }else {
            
    //         console.log("The corresponding restaurant is:")
    //         console.log(result.comments)
    //         res.render("show", {findrestaurant:result})
    //     }
    // })
})

app.post("/listpage/:id/comments",isLoggedIn, (req,res) => {
    Restaurant.findById(req.params.id, (err,therestaurant)=>{
        if(err) {
            console.log(err);
            console.log("The id not existes")
        }else {
            Comment.create(req.body.comment,(err,comment)=>{
                if(err) {
                    console.log(err);
                    console.log("Error: Can't create comments")
                }else {
                    console.log("comment.text is: " + comment.text)
                    console.log("comment.author is: " + comment.author)
                    therestaurant.comments.push(comment)
                    therestaurant.save()
                    console.log("here let me show what the data actually is:")
                    console.log(therestaurant)
                    res.redirect("/listpage/"+therestaurant._id)
                }

            })
            
        }
    })
})

//add new comment---only allowed by the logged-in user
app.get("/listpage/:id/comments/new", (req,res) => {
    Restaurant.findById(req.params.id, (err, result) => {
      if(err) {
        console.log(err);
        console.log("The id not existes")
      }else {
       res.render("newComment", {findrestaurant:result})
      }
    })
})


//========================
//  Authentication Routes
//========================
app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    //res.send("signing up!")
    newUser = new User({username:req.body.username})
    User.register(newUser,req.body.password,(err,user)=>{
        if(err){
            console.log(err);
            return res.render('register')
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/listpage')
        })
    })
})

// login route
app.get("/login", (req,res) => {
    res.render("login")
})

// app.post("/login",middleware,(req,res))
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/listpage",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout logic
app.get("/logout",(req,res)=>{
    req.logout()
    res.redirect("/listpage")
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}






