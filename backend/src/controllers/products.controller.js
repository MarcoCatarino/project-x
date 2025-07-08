import { Product } from "../models/product.model.js";
import { cloudinary } from "../config/cloudinary.js";

// TODO: Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category = "",
      search = "",
      minPrice = 0,
      maxPrice = 999999,
      featured = "",
      isActive = true,
    } = req.query;

    const query = { isActive };

    if (category) query.category = category;
    if (featured !== "") query.featured = featured === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }
    if (minPrice || maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    }

    const products = await Product.find(query)
      .populate("createdBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// TODO: Get Product By ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// TODO: Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, tags, featured } =
      req.body;

    const images =
      req.files?.map((file) => ({
        url: file.path,
        public_id: file.filename,
        alt: name,
      })) || [];

    const product = new Product({
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      featured: featured === "true",
      images,
      createdBy: req.user._id,
    });

    await product.save();
    await product.populate("createdBy", "firstName lastName");

    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
};

// TODO: Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category,
      stock,
      tags,
      featured,
      isActive,
    } = req.body;

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
      featured: featured === "true",
      isActive: isActive !== undefined ? isActive : true,
      updatedBy: req.user._id,
    };

    // Handle new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        alt: name,
      }));
      updateData.images = newImages;
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
};

// TODO: Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((image) =>
        cloudinary.uploader.destroy(image.public_id)
      );
      await Promise.all(deletePromises);
    }

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};

// TODO: Get Categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category", { isActive: true });
    res.json(categories);
  } catch (error) {
    console.error("Get categories error:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};
