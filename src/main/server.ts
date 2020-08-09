import { app } from "./config/app"

const PORT = process.env.PORT || 5050

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
})
