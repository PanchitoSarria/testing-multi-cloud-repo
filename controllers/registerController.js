const UserModel = require("../model/User")

// const usersDB = {
// 	users: require("../model/users.json"),
// 	setUsers: function (data) {
// 		this.users = data
// 	},
// }

// const fsPromises = require("fs").promises
// const path = require("path")
const bcrypt = require("bcrypt")

const handleNewUser = async (req, res) => {
	const { username, pwd } = req.body
	if (!username || !pwd) {
		return res
			.sendStatus(400)
			.json({ message: "username and password are required" })
	}

	const duplicate = await UserModel.findOne({ username: username }).exec()
	// const duplicate = usersDB.users.find((person) => person.username === username)
	if (duplicate) {
		return res.sendStatus(409)
	}
	const hashedPwd = await bcrypt.hash(pwd, 10)

	// const newUser = { username: username, roles: { User: 2001 }, pwd: hashedPwd }
	const newUser = await UserModel.create({
		username: username,
		password: hashedPwd,
	})
	// usersDB.setUsers([...usersDB.users, newUser])
	// await fsPromises.writeFile(
	// 	path.join(__dirname, "..", "model", "users.json"),
	// 	JSON.stringify(usersDB.users)
	// )
	console.log({ newUser })
	res.status(200).json({ message: `User ${username} was created.` })
}

module.exports = { handleNewUser }
