const esClient = require('../config/elasticSearch')
const { default: Product } = require('../models/productModel')
require('dotenv').config()

// Tạo index nếu chưa có
async function createProductIndex() {
    await esClient.indices.delete({ index: 'products', ignore_unavailable: true })
    const exists = await esClient.indices.exists({ index: 'products' })
    if (!exists) {
        await esClient.indices.create({
            index: 'products',
            body: {
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        description: { type: 'text' },
                        tags: { type: 'keyword' },
                        price: { type: 'float' },
                        originalPrice: { type: 'float' },
                        image: { type: 'text' },
                        category: {
                            properties: {
                                id: { type: 'text' },
                                name: { type: 'text' },
                                slug: { type: 'text' }
                            }
                        },
                        stock: { type: 'integer' },
                        rating: { type: 'float' },
                        isActive: { type: 'boolean' },
                        isFeatured: { type: 'boolean' },
                        createdAt: { type: 'date' }
                    }
                }
            }
        })
        console.log('Product index created')
    }
}

// Index 1 sản phẩm
async function indexProduct(product) {
    await esClient.index({
        index: 'products',
        id: product._id.toString(),
        body: {
            name: product.name,
            description: product.description,
            tags: product.tags,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: {
                id: product.category._id,
                name: product.category.name,
                slug: product.category.slug
            },
            stock: product.stock,
            rating: product.rating,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            createdAt: product.createdAt
        }
    })
}

async function importProductToES() {
    const products = await Product.find().populate('category', "name slug")
    if (!products.length) {
        console.log('Không có sản phẩm trong MongoDB')
        return
    }

    const body = products.flatMap(product => [
        { index: { _index: 'products', _id: product._id.toString() } },
        {
            name: product.name,
            description: product.description,
            tags: product.tags,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: {
                id: product.category._id,
                name: product.category.name,
                slug: product.category.slug
            },
            stock: product.stock,
            rating: product.rating,
            isActive: product.isActive,
            isFeatured: product.isFeatured,
            createdAt: product.createdAt
        }
    ])

    const bulkResponse = await esClient.bulk({ refresh: true, operations: body })
    if (bulkResponse.errors) {
        console.error('Lỗi khi import dữ liệu')
    } else {
        console.log(`Đã import ${products.length} sản phẩm vào Elasticsearch`)
    }
}

module.exports = {
    createProductIndex,
    indexProduct,
    importProductToES
}