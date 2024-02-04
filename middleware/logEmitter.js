const { format } = require("date-fns")
const { uuid } = require("uuid")
// const fsPromise = require('fs/promises')
const fsPromise = require("fs").promises
const fs = require("fs")
const path = require("path")

const logEmitter = async (message, file) => {
	const logTime = format(new Date(), `yyyy-MM-dd\thh:mm:ss`)
	const msg = `${logTime}\t${message}\n\n`

	if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
		await fs.mkdir(path.join(__dirname, "..", "logs"), (err) => {
			if (err) console.log(err)
			console.log("The folder has been created")
		})
	}

	try {
		await fsPromise.appendFile(path.join(__dirname, "..", "logs", file), msg)
		console.log("The log has succesfuly been created")
	} catch (error) {
		console.log(error)
	}
}

// console.log(fs.existsSync(path.join(__dirname, "logs")))

module.exports = { logEmitter }
