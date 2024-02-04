const UserModel = require("../model/User")

const jwt = require("jsonwebtoken")

const handleRefreshToken = async (req, res) => {
	const cookies = req.cookies
	if (!cookies?.jwt) return res.sendStatus(401)
	const refreshToken = cookies.jwt

	const foundUser = await UserModel.findOne({ refreshToken })
	if (!foundUser) return res.sendStatus(403) // Forbiden

	jwt.verify(refreshToken, process.env.ACCESS_TOKEN_REFRESH, (err, decoded) => {
		if (err || foundUser.username !== decoded.username) {
			console.log(
				"entra en el condicional de (err || foundUser.username !== decoded.username)",
				{ foundUser },
				"foundUser.username :",
				foundUser.username,
				"decoded.username :",
				decoded.username
			)
			return res.sendStatus(403)
		}
		const roles = Object.values(foundUser.roles)
		const accessToken = jwt.sign(
			{
				UserInfo: {
					username: decoded.username,
					roles: roles,
				},
			},
			process.env.ACCESS_TOKEN_SECRET,
			{ expiresIn: "30s" }
		)
		res.json({ accessToken })
	})
}

module.exports = { handleRefreshToken }
