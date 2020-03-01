const express = require('express');
const app = express();


const port  = 4000;

app.set("view engine","ejs" )

app.listen(port, () => {
    console.log("yelpcamp server is started!"
    )
})

app.get("/", (req, res) => {
    res.render("open")
})

app.get("/landpage", (req, res) => {
    camps = [{name:"yellowstone", image:"https://pixabay.com/get/52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d72d29545cd59_340.jpg" },
    {name:"salmoncreek", image:"https://pixabay.com/get/50e9d4474856b108f5d084609620367d1c3ed9e04e50744177267dd69f45c4_340.jpg"},
    {name:"northpoint", image:"https://pixabay.com/get/57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d72d29545cd59_340.jpg"}]
    res.render("landpage", {camps:camps})
})


