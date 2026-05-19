import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productSchema = new mongoose.Schema({
	title: String,
	description: String,
	code: { type: String, unique: true },
	price: Number,
	status: { type: Boolean, default: true },
	stock: Number,
	category: String,
	thumbnails: { type: Array, default: [] },
});

productSchema.plugin(mongoosePaginate);
export const productModel = mongoose.model("products", productSchema);
