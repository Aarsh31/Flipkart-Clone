const { prisma } = require("../lib/prisma");
const { asyncHandler } = require("../middleware/asyncHandler");
const { getCachedValue, setCachedValue } = require("../utils/cache");
const { serializeProduct } = require("../utils/serialize");

const getCategories = asyncHandler(async (req, res) => {
  const cacheKey = "categories";
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  setCachedValue(cacheKey, categories);
  res.json(categories);
});

const getProducts = asyncHandler(async (req, res) => {
  const { search = "", category = "" } = req.query;
  const cacheKey = `products:${search}:${category}`;
  const cached = getCachedValue(cacheKey);

  if (cached) {
    return res.json(cached);
  }

  const products = await prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { brand: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        category
          ? {
              category: {
                slug: category,
              },
            }
          : {},
      ],
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  const serialized = products.map(serializeProduct);
  setCachedValue(cacheKey, serialized);
  res.json(serialized);
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      category: true,
      images: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(serializeProduct(product));
});

module.exports = { getCategories, getProducts, getProductBySlug };
