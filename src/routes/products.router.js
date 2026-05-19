import { Router } from "express";
import ProductDAO from "../dao/db/product.dao.js";

const router = Router();
const dao = new ProductDAO();

router.get("/", async (req, res) => {
	try {
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

		const result = await dao.get(filter, options);
		res.json({
			status: "success",
			payload: result.docs,
			totalPages: result.totalPages,
			prevPage: result.prevPage,
			nextPage: result.nextPage,
			page: result.page,
			hasPrevPage: result.hasPrevPage,
			hasNextPage: result.hasNextPage,
			prevLink: result.hasPrevPage
				? `/api/products?page=${result.prevPage}`
				: null,
			nextLink: result.hasNextPage
				? `/api/products?page=${result.nextPage}`
				: null,
		});
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.get("/:pid", async (req, res) => {
	try {
		const product = await dao.getById(req.params.pid);
		res.json({ status: "success", payload: product });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.post("/", async (req, res) => {
	try {
		const product = await dao.create(req.body);
		req.app.get("socketio").emit("product_updated", product);
		res.json({ status: "success", payload: product });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.put("/:pid", async (req, res) => {
	try {
		const updated = await dao.update(req.params.pid, req.body);
		res.json({ status: "success", payload: updated });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.delete("/:pid", async (req, res) => {
	try {
		await dao.delete(req.params.pid);
		req.app.get("socketio").emit("product_deleted", req.params.pid);
		res.json({ status: "success", message: "Product deleted" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

export default router;
