const allowedOrigins = require("./allowedOrigins")
const corsOptions = {
	origin: (origin, callback) => {
		if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
			console.log("should trigger callback as true?")
			callback(null, { origin: true })
		} else {
			console.log("inside the default conditional option")
			callback(new Error("Not allowed by CORS policy"))
		}
	},
	optionsSuccessStatus: 200,
}

module.exports = corsOptions
