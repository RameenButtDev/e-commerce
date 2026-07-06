// Run: npm run seed   (loads sample data)
// Run: npm run seed:destroy  (wipes all data)
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Coupon from "./models/Coupon.js";

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();

    const admin = await User.create({
      name: "Admin",
      email: "admin@shop.com",
      password: "admin123",
      role: "admin",
    });

    await User.create({
      name: "Test Customer",
      email: "customer@shop.com",
      password: "customer123",
      role: "customer",
    });

    const categories = await Category.insertMany([
      { name: "Electronics", slug: "electronics" },
      { name: "Fashion", slug: "fashion" },
      { name: "Home & Living", slug: "home-living" },
      { name: "Beauty", slug: "beauty" },
    ]);

    const sampleProducts = [
      {
        name: "Wireless Bluetooth Earbuds",
        description: "High quality wireless earbuds with noise cancellation and 24hr battery life.",
        category: categories[0]._id,
        brand: "SoundMax",
        price: 4999,
        discountPrice: 3999,
        countInStock: 25,
        images: [],
        isFeatured: true,
      },
      {
        name: "Smart Watch Series 5",
        description: "Fitness tracking, heart rate monitor, and notifications on your wrist.",
        category: categories[0]._id,
        brand: "TechFit",
        price: 8999,
        discountPrice: 0,
        countInStock: 15,
        images: [],
        isFeatured: true,
      },
      {
        name: "Men's Casual Shirt",
        description: "100% cotton, breathable casual shirt available in multiple sizes.",
        category: categories[1]._id,
        brand: "UrbanWear",
        price: 1999,
        discountPrice: 1499,
        countInStock: 40,
        images: [],
        isFeatured: true,
      },
      {
        name: "Ceramic Dinner Set (12pcs)",
        description: "Elegant ceramic dinner set perfect for family gatherings.",
        category: categories[2]._id,
        brand: "HomeCraft",
        price: 5499,
        discountPrice: 0,
        countInStock: 10,
        images: [],
        isFeatured: false,
      },
      {
        name: "Matte Lipstick Set",
        description: "Long-lasting matte lipstick set with 6 vibrant shades.",
        category: categories[3]._id,
        brand: "GlowUp",
        price: 1299,
        discountPrice: 999,
        countInStock: 50,
        images: [],
        isFeatured: true,
      },
    ];

    for (const p of sampleProducts) {
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-5);
      await Product.create({ ...p, slug });
    }

    await Coupon.create({
      code: "WELCOME10",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 1000,
      maxUses: 100,
    });

    console.log("Sample data imported successfully!");
    console.log("Admin login: admin@shop.com / admin123");
    console.log("Customer login: customer@shop.com / customer123");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    await Coupon.deleteMany();
    console.log("All data destroyed!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
