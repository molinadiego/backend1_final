const socket = io();

socket.on("product_updated", (product) => {
	const container = document.getElementById("products-container");
	if (container) {
		const existing = document.getElementById(`prod-${product._id}`);
		if (existing) {
			existing.innerHTML = `<h3>${product.title}</h3><p>${product.description}</p><p>Precio: $${product.price}</p><a href="/products/${product._id}">Ver detalle</a>`;
		} else {
			const div = document.createElement("div");
			div.id = `prod-${product._id}`;
			div.style = "border: 1px solid #ccc; margin: 10px; padding: 10px;";
			div.innerHTML = `<h3>${product.title}</h3><p>${product.description}</p><p>Precio: $${product.price}</p><a href="/products/${product._id}">Ver detalle</a>`;
			container.appendChild(div);
		}
	}
});

socket.on("product_deleted", (pid) => {
	const el = document.getElementById(`prod-${pid}`);
	if (el) el.remove();
});

async function addToCart(cartId, productId) {
	await fetch(`/api/carts/${cartId}/products/${productId}`, { method: "POST" });
	alert("Producto agregado al carrito");
}
