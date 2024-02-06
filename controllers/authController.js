// This is just a comment to check the successful push to both repos

const UserModel = require("../model/User")

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const handleAuth = async (req, res) => {
	const { username, pwd } = req.body
	if (!username || !pwd)
		return res
			.sendStatus(400)
			.json({ message: "User and password are required" })

	const foundUser = await UserModel.findOne({ username: username }).exec()
	if (!foundUser) return res.sendStatus(401) // Unauthorized
	// evaluate password
	const match = await bcrypt.compare(pwd, foundUser.password)
	if (match) {
		// create JWTs
		const roles = Object.values(foundUser.roles)
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: foundUser.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "30s" }
		)
		const refreshToken = jwt.sign(
			{ username: foundUser.username },
			process.env.ACCESS_TOKEN_REFRESH,
			{ expiresIn: "24h" }
		)
		foundUser.refreshToken = refreshToken
		const result = await foundUser.save()
		console.log({ result })

		res.cookie("jwt", refreshToken, {
			httpOnly: true,
			sameSite: "None",
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
		})
		res.json({ accessToken })
	} else {
		res.sendStatus(401)
	}
}

module.exports = { handleAuth }
