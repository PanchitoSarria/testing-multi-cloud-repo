const EmployeesModel = require("../model/Employee")
const data = {
	employees: require("../model/employees.json"),
	setEmployees: function (data) {
		this.employees = data
	},
}

const getAllEmployees = async (req, res) => {
	const result = await EmployeesModel.find()
	res.json(result)
}

const createNewEmployee = async (req, res) => {
	// console.log("body:", req.body)

	if (!req.body.firstname || !req.body.lastname) {
		return res
			.status(400)
			.json({ message: "First name and last name must be supplied" })
	}

	const result = await EmployeesModel.create({
		firstname: req.body.firstname,
		lastname: req.body.lastname,
	})

	console.log({ result })

	res.status(201).json(result)
}

const updateEmployee = async (req, res) => {
	const employee = await EmployeesModel.findOne({ _id: req.body.id })
	console.log({ employee })
	if (!employee) {
		return res
			.status(400)
			.json({ mesage: `Employee with the id ${req.body.id} not found` })
	}

	if (req?.body?.firstname) employee.firstname = req?.body?.firstname
	if (req?.body?.lastname) employee.lastname = req?.body?.lastname

	const result = await employee.save()

	res.status(201).json(result)
}

const deleteEmployee = async (req, res) => {
	const employee = await EmployeesModel.findOne({ _id: req.body._id })
	if (!employee) {
		return res
			.status(400)
			.json({ message: `Employee with id ${req.body.id} not found in the DB` })
	}

	const result = await EmployeesModel.deleteOne({ _id: req.body._id })
	res.status(201).json(result)
}

const getEmployee = async (req, res) => {
	const employee = await EmployeesModel.findById(req.params.id)
	if (!employee) {
		return res.status(400).json({
			message: `The employee with id ${req.params.id} couldn't be found.`,
		})
	}

	res.json({
		employee,
	})
}

module.exports = {
	getAllEmployees,
	createNewEmployee,
	updateEmployee,
	deleteEmployee,
	getEmployee,
}
