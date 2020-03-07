const express = require('express');
const app = express();
var bodyParser = require('body-parser')

const mongoose = require('mongoose')
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true })
mongoose.set('useUnifiedTopology', true);
var Campground = require('./models/campground')

app.use(bodyParser.urlencoded({extended:true}))



const port  = 4000;

var camps = [{name:"yellowstone", image:"https://i0.wp.com/www.devilslakewisconsin.com/wp-content/uploads/2018/12/campingheader-small.jpg?fit=750%2C307&ssl=1" },
    {name:"salmoncreek", image:"https://www.reserveamerica.com/webphotos/racms/articles/images/fef91bb3-1dff-444d-b0e5-d14db129ce1d_image2_3-penn-new.jpg"},
    {name:"capitalrock", image:"https://cdn.britannica.com/75/93575-050-8ADFBBE0/fishing-Camping-activities-canoeing-Minnesota-Boundary-Waters.jpg"}]

app.set("view engine","ejs" )

app.listen(port, () => {
    console.log("yelpcamp server is started!"
    )
})

app.get("/", (req, res) => {
    res.render("landpage")
})

app.get("/listpage", (req, res) => {
    res.render("listpage", {camps:camps})
})

app.post("/listpage", function(req,res){
    var name = req.body.campname
    var url = req.body.imgurl
    var newcamp = {name:name, image:url}
    console.log(newcamp)
    camps.push(newcamp)
    res.redirect("/listpage")

})

app.get("/listpage/new", (req, res) => {
    res.render("new")
})






