const Product = require("../models/product");

const getAllProducts = async (req, res) => {
	const { featured, company, name, sort, fields, numericFilter } = req.query;
	// const queryObject = {
	// 	featured,
	// 	company,
	// };
	const queryObject = {};
	if (featured) queryObject.featured = featured === "true" ? true : false;

	if (company) queryObject.company = company;

	if (name) queryObject.name = { $regex: name, $options: "i" };

	// Filter
	if (numericFilter) {
		const operatorMap = {
			">": "$gt",
			"<": "$lt",
			">=": "$gte",
			"=": "$eq",
			"<=": "$lte",
		};
		const reqEx = /\b(<|>|>=|=|<|<=)\b/g;
		let filters = numericFilter.replace(
			reqEx,
			(match) => `-${operatorMap[match]}-`
		);
		console.log(filters);
		const options = ["price", "rating"];
		filters = filters.split(",").forEach((item) => {
			const [field, operator, value] = item.split("-");
			if (options.includes(field)) {
				queryObject[field] = { [operator]: Number(value) };
			}
		});
	}

	let result = Product.find(queryObject);
	// Sort
	if (sort) {
		const sortList = sort.split(",").join(" ");
		console.log(sortList);
		result.sort(sortList);
	}

	// Select
	if (fields) {
		const fieldList = fields.split(",").join(" ");
		result.select(fieldList);
	}
	// Page and Limit
	const page = Number(req.query.page) || 1;
	const limit = Number(req.query.limit) || 10;
	const skip = (page - 1) * limit;
	result = result.skip(skip).limit(limit);

	const products = await result;
	res.status(200).json({ products, nbHits: products.length });
};
const getAllProductsStatic = async (req, res) => {
	res.status(200).json({ msg: "All Store Products" });
};

module.exports = {
	getAllProducts,
	getAllProductsStatic,
};
