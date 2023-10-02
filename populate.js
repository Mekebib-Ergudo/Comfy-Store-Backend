require("dotenv").config();

const Product = require("./models/product");

const connectDB = require("./db/connect");

const jsonProducts = require("./products.json");

const start = async () => {
	try {
		await connectDB(process.env.Mongo_ulr);
		await Product.deleteMany();
		await Product.create(jsonProducts);
		console.log("connected!!");
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

start();
