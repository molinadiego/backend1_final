import mongoose from "mongoose";
import { productModel } from "../src/models/product.model.js"; // Ajusta las rutas según tu proyecto
import { cartModel } from "../src/models/cart.model.js";

// MONGO_URL de tu cluster de MongoDB Atlas
const MONGO_URL =
	"mongodb+srv://nodePractice:JI2hU5shOriMfPyp@wineshop.5hd4ct8.mongodb.net/computer?appName=Computer-Shop";

const products = [
	{
		title: "Nvidia RTX 4090 Asus ROG Strix",
		description:
			"Placa de video de gama alta con 24GB GDDR6X, ideal para gaming 4K y renderizado.",
		code: "PROD-RTX4090",
		price: 2200,
		status: true,
		stock: 5,
		category: "Placas de Video",
		thumbnails: [],
	},
	{
		title: "Nvidia RTX 4070 Ti Gigabyte Gaming",
		description:
			"Excelente rendimiento precio-calidad para 1440p con 12GB GDDR6X y DLSS 3.",
		code: "PROD-RTX4070TI",
		price: 850,
		status: true,
		stock: 12,
		category: "Placas de Video",
		thumbnails: [],
	},
	{
		title: "Procesador AMD Ryzen 7 7800X3D",
		description:
			"El mejor procesador para gaming del mercado gracias a su tecnología 3D V-Cache.",
		code: "PROD-R77800X3D",
		price: 399,
		status: true,
		stock: 20,
		category: "Procesadores",
		thumbnails: [],
	},
	{
		title: "Disco SSD NVMe M.2 Samsung 990 Pro 2TB",
		description:
			"Almacenamiento ultra rápido PCIe Gen4 con velocidades de lectura de hasta 7450 MB/s.",
		code: "PROD-SSD2TB990",
		price: 170,
		status: true,
		stock: 18,
		category: "Almacenamiento",
		thumbnails: [],
	},
	{
		title: 'Monitor Gamer LG UltraGear 27"',
		description:
			"Pantalla IPS Nano, resolución QHD (2K), 165Hz de tasa de refresco.",
		code: "PROD-MONLG27",
		price: 450,
		status: true,
		stock: 10,
		category: "Monitores",
		thumbnails: [],
	},
];

const seedDB = async () => {
	try {
		console.log("🚀 Conectando a MongoDB Atlas...");
		await mongoose.connect(MONGO_URL);

		// 1. LIMPIEZA DE DATOS PREVIOS
		console.log("🧹 Limpiando colecciones anteriores (Products y Carts)...");
		await productModel.deleteMany({});
		await cartModel.deleteMany({});

		// 2. POBLAR PRODUCTOS
		console.log("📦 Insertando productos semilla...");
		const createdProducts = await productModel.insertMany(products);
		console.log(`✅ ${createdProducts.length} Productos insertados con éxito.`);

		// OBTENER IDs GENERADOS POR MONGO PARA LA RELACIÓN
		const rtx4090Id = createdProducts[0]._id;
		const rtx4070Id = createdProducts[1]._id;
		const ryzenId = createdProducts[2]._id;

		// 3. POBLAR CARRITOS USANDO LOS IDs DE LOS PRODUCTOS
		console.log("🛒 Generando carritos de prueba con referencias...");

		const carts = [
			{
				// Carrito 1: Contiene 1 placa RTX 4090 y 2 procesadores Ryzen
				products: [
					{ product: rtx4090Id, quantity: 1 },
					{ product: ryzenId, quantity: 2 },
				],
			},
			{
				// Carrito 2: Contiene 2 placas RTX 4070
				products: [{ product: rtx4070Id, quantity: 2 }],
			},
			{
				// Carrito 3: Inicializado completamente vacío
				products: [],
			},
		];

		const createdCarts = await cartModel.insertMany(carts);
		console.log(
			`✅ ${createdCarts.length} Carritos de prueba creados con éxito.`,
		);

		// LOG CON LAS IDs DE LOS CARRITOS PARA FACILITAR TUS PRUEBAS EN THUNDERCLIENT
		console.log("\n====== IDs PARA TUS PRUEBAS EN THUNDERCLIENT ======");
		createdCarts.forEach((cart, index) => {
			console.log(`Carrito ${index + 1} ID: ${cart._id}`);
		});
		console.log("===================================================\n");
	} catch (error) {
		console.error("❌ Error crítico durante el proceso de seeding:", error);
	} finally {
		await mongoose.disconnect();
		console.log("🔒 Conexión a MongoDB cerrada de forma segura.");
		process.exit(0);
	}
};

seedDB();
