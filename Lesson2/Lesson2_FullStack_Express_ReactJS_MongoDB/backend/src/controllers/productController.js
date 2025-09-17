import esClient from "../config/elasticSearch.js"
import Category from "../models/categoryModel.js"
import Product from "../models/productModel.js"

// Get product
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = req.query

    const from = (parseInt(page) - 1) * parseInt(limit)

    // Elasticsearch query
    let must = [{ match: { isActive: true } }]
    let filter = []

    if (category) {
      must.push({ match: { category: category } })
    }

    if (search) {
      must.push({
        multi_match: {
          query: search,
          fields: ['name^3', 'description', 'tags'], // ^3 để ưu tiên fields name
          fuzziness: 'AUTO'
        }
      })
    }

    if (minPrice || maxPrice) {
      let range = {}
      if (minPrice) range.$gte = parseFloat(minPrice)
      if (maxPrice) range.$lte = parseFloat(maxPrice)
      filter.push({ range: { price: range } })
    }

    const sort = {}
    sort[sortBy] = {order: sortOrder}
    
    const result = await esClient.search({
      index: 'products',
      from,
      size: parseInt(limit),
      query: {
        bool: {
          must,
          filter
        }
      },
      sort: [sort]
    })

    const products = result.hits.hits.map(hit => ({
      id: hit._id,
      ...hit._source
    }))

    const totalProducts = result.hits.total.value
    const totalPages = Math.ceil(totalProducts/parseInt(limit))

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    })
  } catch(error){
    console.error(error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm từ Elasticsearch',
      error
    })
  }
}
// Get productMongo
const getProductss = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      minPrice,
      maxPrice
    } = req.query

    // filter
    const filter = { isActive: true }

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
    }

    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = parseFloat(minPrice)
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice)
    }

    const sort = {}
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1

    const skip = (parseInt(page) - 1) * parseInt(limit)

    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))

    const totalProducts = await Product.countDocuments(filter)
    const totalPages = Math.ceil(totalProducts / parseInt(limit))

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalProducts,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    })
  }
  catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách sản phẩm',
      error
    })
  }
}

const seedData = async (req, res) => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create categories
    const categories = await Category.insertMany([
      {
        name: 'Điện thoại',
        description: 'Các loại điện thoại thông minh',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
        slug: 'dien-thoai'
      },
      {
        name: 'Laptop',
        description: 'Máy tính xách tay',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
        slug: 'laptop'
      },
      {
        name: 'Phụ kiện',
        description: 'Phụ kiện công nghệ',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400',
        slug: 'phu-kien'
      },
      {
        name: 'Tablet',
        description: 'Máy tính bảng',
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400',
        slug: 'tablet'
      }
    ]);

    // Create products
    const products = [];
    const phoneCategory = categories.find(c => c.slug === 'dien-thoai');
    const laptopCategory = categories.find(c => c.slug === 'laptop');
    const accessoryCategory = categories.find(c => c.slug === 'phu-kien');
    const tabletCategory = categories.find(c => c.slug === 'tablet');

    // Phone products
    for (let i = 1; i <= 25; i++) {
      products.push({
        name: `iPhone ${13 + (i % 3)} ${i > 15 ? 'Pro' : ''}`,
        description: `Điện thoại thông minh cao cấp từ Apple với thiết kế sang trọng và hiệu năng mạnh mẽ. Sản phẩm số ${i}`,
        price: 15000000 + (i * 100000),
        originalPrice: 18000000 + (i * 100000),
        image: `https://images.unsplash.com/photo-${1511707171634 + i}?w=400`,
        category: phoneCategory._id,
        stock: 50 + i,
        rating: 4 + (i % 2) * 0.5,
        reviewCount: 100 + i * 5,
        tags: ['Apple', 'iPhone', 'Smartphone'],
        isFeatured: i <= 5
      });
    }

    // Laptop products
    for (let i = 1; i <= 20; i++) {
      products.push({
        name: `MacBook ${i > 10 ? 'Pro' : 'Air'} M${1 + (i % 2)}`,
        description: `Máy tính xách tay cao cấp từ Apple với chip M${1 + (i % 2)} mạnh mẽ. Sản phẩm số ${i}`,
        price: 25000000 + (i * 200000),
        originalPrice: 28000000 + (i * 200000),
        image: `https://images.unsplash.com/photo-${1496181133206 + i}?w=400`,
        category: laptopCategory._id,
        stock: 30 + i,
        rating: 4.2 + (i % 3) * 0.2,
        reviewCount: 80 + i * 3,
        tags: ['Apple', 'MacBook', 'Laptop'],
        isFeatured: i <= 3
      });
    }

    // Accessory products
    for (let i = 1; i <= 30; i++) {
      products.push({
        name: `${i % 3 === 0 ? 'AirPods' : i % 2 === 0 ? 'Ốp lưng' : 'Sạc'} ${i}`,
        description: `Phụ kiện chất lượng cao cho thiết bị di động. Sản phẩm số ${i}`,
        price: 500000 + (i * 50000),
        originalPrice: 700000 + (i * 50000),
        image: `https://images.unsplash.com/photo-${1572569511254 + i}?w=400`,
        category: accessoryCategory._id,
        stock: 100 + i,
        rating: 4.0 + (i % 4) * 0.25,
        reviewCount: 50 + i * 2,
        tags: ['Phụ kiện', 'Apple', 'Accessory'],
        isFeatured: i <= 2
      });
    }

    // Tablet products
    for (let i = 1; i <= 15; i++) {
      products.push({
        name: `iPad ${i > 8 ? 'Pro' : 'Air'} ${i}`,
        description: `Máy tính bảng cao cấp từ Apple với màn hình sắc nét. Sản phẩm số ${i}`,
        price: 12000000 + (i * 150000),
        originalPrice: 14000000 + (i * 150000),
        image: `https://images.unsplash.com/photo-${1544244015000 + i}?w=400`,
        category: tabletCategory._id,
        stock: 40 + i,
        rating: 4.3 + (i % 3) * 0.1,
        reviewCount: 90 + i * 4,
        tags: ['Apple', 'iPad', 'Tablet'],
        isFeatured: i <= 4
      });
    }

    await Product.insertMany(products);

    res.json({
      success: true,
      message: `Đã tạo ${categories.length} danh mục và ${products.length} sản phẩm mẫu`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo dữ liệu mẫu',
      error: error.message
    });
  }
}

export const productController = {
  getProducts,
  seedData
}