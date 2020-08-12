const tasks = (arr) => arr.join(" && ")

module.exports = {
	hooks: {
		"pre-commit": tasks(["npx lint-staged"]),
		"pre-commit": tasks(["npm run test:ci"]),
	},
}
