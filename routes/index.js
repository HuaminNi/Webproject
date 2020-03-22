var express = require('express')
var router = express.Router()
var passport = require('passport')
var User = require('../models/user')


router.get("/", (req, res) => {
    res.render("landpage")
})

//========================
//  Authentication Routes
//========================
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
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
router.get("/login", (req,res) => {
    res.render("login")
})

// app.post("/login",middleware,(req,res))
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/listpage",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout logic
router.get("/logout",(req,res)=>{
    req.logout()
    res.redirect("/listpage")
})

module.exports=router