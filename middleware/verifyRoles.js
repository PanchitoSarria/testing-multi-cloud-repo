const verifyRoles = (...allowedRoles) => {
	return (req, res, next) => {
		if (!req?.roles) {
			console.log("verify Roles no pasó la primer barrera")
			return res.sendStatus(401)
		}
		const rolesArray = [...allowedRoles]
		console.log({ rolesArray }, { "req.roles": req.roles })
		const result = req.roles
			.map((role) => rolesArray.includes(role))
			.find((role) => role === true)
		if (!result) {
			console.log("verify Roles no pasó la segunda barrera")
			return res.sendStatus(401)
		}
		next()
	}
}
module.exports = verifyRoles
