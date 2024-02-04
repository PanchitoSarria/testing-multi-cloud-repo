const express = require("express")
const route = express.Router()
const { handleLogout } = require("../controllers/logoutController")

route.get("/", handleLogout)

module.exports = route
