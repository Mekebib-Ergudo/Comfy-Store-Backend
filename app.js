require("dotenv").config();
const express = require("express"); // Express web server framework.
require("express-async-errors");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFound = require("./middleware/not-found");
const connectDB = require("./db/connect");
const productsRouter = require("./routes/products");
// Port
const port = process.env.Port;
const app = express();
app.use(express.json()); // to support JSON-encoded bodies

// ProductRouts
app.use("/api/v1/products", productsRouter);

// middleWare
app.use(errorHandlerMiddleware);
app.use(notFound);

// connect to the Db
const start = async () => {
	try {
		// database Connection
		await connectDB(process.env.Mongo_ulr);
		app.listen(port, console.log(`Server is Listening at port ${port}...`));
	} catch (error) {
		console.log(error);
	}
};
start();
