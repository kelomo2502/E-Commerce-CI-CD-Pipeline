const express = require("express");
const services = express()

services.get("/services",(req,res)=>{
    res.status(200).json({message:"We offer good services"})
})

module.exports = services