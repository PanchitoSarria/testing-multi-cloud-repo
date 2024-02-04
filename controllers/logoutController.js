const UserModel = require("../model/User")

const handleLogout = async (req, res) => {
	const cookies = req.cookies
	if (!cookies) return res.sendStatus(401)
	const refreshToken = cookies.jwt

	const foundUser = await UserModel.findOne({ refreshToken }).exec()
	if (!foundUser) {
		res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }) // secure: true may cause problems with some clients
		res.sendStatus(204) //Ok but without content
	}

	foundUser.refreshToken = ""
	const result = await foundUser.save()
	console.log({ result })

	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true })
	res.sendStatus(204)
}

module.exports = { handleLogout }
