var express = require('express')
var router = express.Router()
var Restaurant = require("../models/restaurants")
var Comment = require('../models/comment')


router.get("/", (req, res) => {
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

router.post("/", function(req,res){
    var name = req.body.campname
    var url = req.body.imgurl
    var desc = req.body.description
    var newcamp = {name:name, image:url,description:desc}
    console.log(newcamp)
    camps.push(newcamp)
    res.redirect("/listpage")

})

router.get("/new", (req, res) => {
    res.render("new")
})

router.get("/:id", (req, res) => {
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

router.post("/:id/comments",isLoggedIn, (req,res) => {
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
router.get("/:id/comments/new", isLoggedIn, (req,res) => {
    Restaurant.findById(req.params.id, (err, result) => {
      if(err) {
        console.log(err);
        console.log("The id not existes")
      }else {
       res.render("newComment", {findrestaurant:result})
      }
    })
})

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router
