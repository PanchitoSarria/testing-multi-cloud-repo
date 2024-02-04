require("dotenv").config()
const path = require("path")
const express = require("express")
const cors = require("cors")
const { logEmitter } = require("./middleware/logEmitter")
const corsOptions = require("./config/corsOptions")
const verifyJWT = require("./middleware/verifyJWT")
const cookieParser = require("cookie-parser")
const connectDB = require("./config/dbConnection")
const mongoose = require("mongoose")

connectDB()
const app = express()
const PORT = process.env.PORT || 3500

app.use((req, res, next) => {
	logEmitter(`${req.origin} \t ${req.url}`, "logs.txt")
	next()
})

app.use(require("./middleware/credentials"))

app.use(cors(corsOptions))

app.use(express.json())
// app.use(express.urlencoded("application/x-www-form-urlencoded"))

app.use(cookieParser())

app.use(express.static(path.join(__dirname, "public")))
app.use("/subdir", express.static(path.join(__dirname, "public")))

app.use("/", require(path.join(__dirname, "routes", "root.js")))
app.use("/subdir", require(path.join(__dirname, "routes", "subdir.js")))

app.use("/register", require(path.join(__dirname, "routes", "register")))
app.use("/auth", require(path.join(__dirname, "routes", "auth")))

app.use("/refresh", require("./routes/refresh"))

app.use("/logout", require("./routes/logout"))

app.use(verifyJWT)
app.use(
	"/employees",
	require(path.join(__dirname, "routes", "api", "employees.js"))
)

app.get(
	"/hello",
	(req, res, next) => {
		console.log("before next")
		next()
	},
	(req, res) => {
		console.log("after next")
		res.send("hello request with next parameter")
	}
)

app.get("/*", (req, res) => {
	res.status(404).sendFile(path.join(__dirname, "views", "404.html"))
})

mongoose.connection.on("open", () => {
	console.log("open event | Connected to MongoDB")
	app.listen(PORT, () => {
		console.log(`Server running on port ${PORT}`)
	})
})
