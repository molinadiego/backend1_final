import { Router } from "express";
import CartDAO from "../dao/db/cart.dao.js";

const router = Router();
const dao = new CartDAO();

router.post("/", async (req, res) => {
	try {
		const cart = await dao.create();
		res.json({ status: "success", payload: cart });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.get("/:cid", async (req, res) => {
	try {
		const cart = await dao.getById(req.params.cid);
		res.json({ status: "success", payload: cart });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.post("/:cid/products/:pid", async (req, res) => {
	try {
		const cart = await dao.getById(req.params.cid);
		const index = cart.products.findIndex(
			(p) => p.product._id.toString() === req.params.pid,
		);

		if (index !== -1) {
			cart.products[index].quantity++;
		} else {
			cart.products.push({ product: req.params.pid, quantity: 1 });
		}

		await dao.update(req.params.cid, cart.products);
		res.json({ status: "success" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.delete("/:cid/products/:pid", async (req, res) => {
	try {
		const cart = await dao.getById(req.params.cid);
		cart.products = cart.products.filter(
			(p) => p.product._id.toString() !== req.params.pid,
		);
		await dao.update(req.params.cid, cart.products);
		res.json({ status: "success" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.put("/:cid", async (req, res) => {
	try {
		await dao.update(req.params.cid, req.body.products);
		res.json({ status: "success" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.put("/:cid/products/:pid", async (req, res) => {
	try {
		const cart = await dao.getById(req.params.cid);
		const index = cart.products.findIndex(
			(p) => p.product._id.toString() === req.params.pid,
		);
		if (index !== -1) {
			cart.products[index].quantity = req.body.quantity;
			await dao.update(req.params.cid, cart.products);
		}
		res.json({ status: "success" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

router.delete("/:cid", async (req, res) => {
	try {
		await dao.clear(req.params.cid);
		res.json({ status: "success" });
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

export default router;
