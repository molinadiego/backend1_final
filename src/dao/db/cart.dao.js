import { cartModel } from "../../models/cart.model.js";

export default class CartDAO {
	async create() {
		return await cartModel.create({ products: [] });
	}
	async getById(id) {
		return await cartModel.findById(id).lean();
	}
	async update(id, products) {
		return await cartModel.findByIdAndUpdate(id, { products }, { new: true });
	}
	async clear(id) {
		return await cartModel.findByIdAndUpdate(
			id,
			{ products: [] },
			{ new: true },
		);
	}
}
