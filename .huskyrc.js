const tasks = (arr) => arr.join(" && ")

module.exports = {
	hooks: {
		"pre-commit": tasks(["npm run lint-staged", "yarn test:staged"]),
		"pre-push": "npm run test:ci",
	},
}
