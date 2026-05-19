import { productModel } from "../../models/product.model.js";

export default class ProductDAO {
	async get(filter, options) {
		return await productModel.paginate(filter, options);
	}
	async getById(id) {
		return await productModel.findById(id);
	}
	async create(data) {
		return await productModel.create(data);
	}
	async update(id, data) {
		return await productModel.findByIdAndUpdate(id, data, { new: true });
	}
	async delete(id) {
		return await productModel.findByIdAndDelete(id);
	}
}
