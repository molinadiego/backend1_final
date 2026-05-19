import { Router } from "express";
import ProductDAO from "../dao/db/product.dao.js";
import CartDAO from "../dao/db/cart.dao.js";

const router = Router();
const productDao = new ProductDAO();
const cartDao = new CartDAO();

router.get("/products", async (req, res) => {
	const { limit = 10, page = 1, sort, query } = req.query;
	const filter = query
		? { $or: [{ category: query }, { status: query === "true" }] }
		: {};
	const options = {
		limit: parseInt(limit),
		page: parseInt(page),
		sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
		lean: true,
	};
	const result = await productDao.get(filter, options);
	res.render("products", result);
});

router.get("/products/:pid", async (req, res) => {
	const product = await productDao.getById(req.params.pid);
	res.render("productDetail", product.toObject());
});

router.get("/carts/:cid", async (req, res) => {
	const cart = await cartDao.getById(req.params.cid);
	res.render("cart", cart);
});

export default router;
