import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layout, 
  Card, 
  Input, 
  Select, 
  Button, 
  Row, 
  Col, 
  Typography, 
  Rate, 
  Tag, 
  Badge, 
  Spin, 
  Empty, 
  Space,
  Collapse,
  Tooltip,
  message
} from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  ShoppingCartOutlined, 
  HeartOutlined, 
  EyeOutlined,
  StarFilled
} from '@ant-design/icons';
import { getCategories, getProducts } from '../util/api';

const { Header, Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const ProductStore = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const result = await getCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      message.error('Lỗi khi lấy danh mục');
      console.error('Lỗi khi lấy danh mục:', error);
    }
  }, []);

  // Fetch products with lazy loading
  const fetchProducts = useCallback(async (pageNum = 1, reset = false) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum.toString(),
        limit: '12',
        sortBy,
        sortOrder
      });

      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);

      const result = await getProducts(params);
      // const result = await response.json();

      if (result.success) {
        const newProducts = result.data.products;
        
        if (reset) {
          setProducts(newProducts);
        } else {
          setProducts(prev => [...prev, ...newProducts]);
        }
        
        setHasMore(result.data.pagination.hasNextPage);
        setPage(pageNum);
      }
    } catch (error) {
      message.error('Lỗi khi lấy sản phẩm');
      console.error('Lỗi khi lấy sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm, sortBy, sortOrder, loading]);

  // Load more products
  const loadMore = useCallback(() => {
    if (hasMore && !loading) {
      fetchProducts(page + 1, false);
    }
  }, [fetchProducts, page, hasMore, loading]);

  // Reset and fetch new products when filters change
  const resetAndFetch = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    fetchProducts(1, true);
  }, [fetchProducts]);

  // Initialize
  useEffect(() => {
    fetchCategories();
    resetAndFetch();
  }, []);

  // Reset when filters change
  useEffect(() => {
    resetAndFetch();
  }, [selectedCategory, searchTerm, sortBy, sortOrder]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Calculate discount percentage
  const calculateDiscount = (original, current) => {
    if (!original || original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    if (product.stock > 0) {
      message.success(`Đã thêm ${product.name} vào giỏ hàng`);
    }
  };

  // Handle wishlist
  const handleWishlist = (product) => {
    message.success(`Đã thêm ${product.name} vào danh sách yêu thích`);
  };

  // Handle view product
  const handleViewProduct = (product) => {
    message.info(`Xem chi tiết ${product.name}`);
  };

  const filterPanel = (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Danh mục</Text>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: '100%' }}
              placeholder="Tất cả danh mục"
            >
              <Option value="">Tất cả danh mục</Option>
              {categories.map(category => (
                <Option key={category._id} value={category._id}>
                  {category.name}
                </Option>
              ))}
            </Select>
          </Space>
        </Col>
        
        <Col xs={24} md={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Sắp xếp theo</Text>
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: '100%' }}
            >
              <Option value="createdAt">Mới nhất</Option>
              <Option value="price">Giá</Option>
              <Option value="rating">Đánh giá</Option>
              <Option value="name">Tên</Option>
            </Select>
          </Space>
        </Col>
        
        <Col xs={24} md={8}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Thứ tự</Text>
            <Select
              value={sortOrder}
              onChange={setSortOrder}
              style={{ width: '100%' }}
            >
              <Option value="desc">Giảm dần</Option>
              <Option value="asc">Tăng dần</Option>
            </Select>
          </Space>
        </Col>
      </Row>
    </div>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Header style={{ backgroundColor: '#fff', padding: '0 24px', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Title level={2} style={{ margin: '16px 0' }}>
            Cửa hàng điện tử
          </Title>
        </div>
      </Header>

      <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {/* Di chuyển search và filter vào Content */}
        <div style={{ marginBottom: 24, backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={16}>
              <Input
                size="large"
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ maxWidth: 400 }}
              />
            </Col>
            
            <Col xs={24} md={8}>
              <Button
                icon={<FilterOutlined />}
                onClick={() => setShowFilters(!showFilters)}
                style={{ width: '100%', maxWidth: 200 }}
              >
                Bộ lọc
              </Button>
            </Col>
          </Row>

          {showFilters && (
            <div style={{ marginTop: 16 }}>
              <Collapse activeKey={['1']}>
                <Panel header="Bộ lọc tìm kiếm" key="1">
                  {filterPanel}
                </Panel>
              </Collapse>
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <Text type="secondary">
            Hiển thị {products.length} sản phẩm
            {selectedCategory && (
              <span> trong danh mục "{categories.find(c => c._id === selectedCategory)?.name}"</span>
            )}
          </Text>
        </div>

        <Spin spinning={loading && products.length === 0}>
          {products.length > 0 ? (
            <>
              <Row gutter={[16, 16]}>
                {products.map((product, index) => (
                  <Col xs={24} sm={12} lg={8} xl={6} key={`${product._id}-${index}`}>
                    <Card
                      hoverable
                      style={{ height: '100%' }}
                      cover={
                        <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
                          <img
                            alt={product.name}
                            src={product.image || `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop`;
                            }}
                          />
                          
                          {/* Badges */}
                          <div style={{ position: 'absolute', top: 8, left: 8 }}>
                            {product.isFeatured && (
                              <Tag color="red" style={{ margin: 0, marginRight: 4 }}>
                                Nổi bật
                              </Tag>
                            )}
                            {product.originalPrice && calculateDiscount(product.originalPrice, product.price) > 0 && (
                              <Tag color="green" style={{ margin: 0 }}>
                                -{calculateDiscount(product.originalPrice, product.price)}%
                              </Tag>
                            )}
                          </div>

                          {/* Hover Actions */}
                          <div style={{ 
                            position: 'absolute', 
                            top: 8, 
                            right: 8,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                          }}>
                            <Tooltip title="Xem chi tiết">
                              <Button 
                                shape="circle" 
                                icon={<EyeOutlined />}
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProduct(product);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Thêm vào yêu thích">
                              <Button 
                                shape="circle" 
                                icon={<HeartOutlined />}
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWishlist(product);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      }
                      actions={[
                        <Button
                          key="add-to-cart"
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(product)}
                          style={{ width: '90%' }}
                        >
                          {product.stock > 0 ? 'Thêm vào giỏ' : 'Hết hàng'}
                        </Button>
                      ]}
                    >
                      <Card.Meta
                        title={
                          <div>
                            <Tag color="blue" style={{ marginBottom: 8 }}>
                              {product.category?.name}
                            </Tag>
                            <div style={{ 
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              fontSize: 16,
                              fontWeight: 600
                            }}>
                              {product.name}
                            </div>
                          </div>
                        }
                        description={
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Rate disabled defaultValue={product.rating} style={{ fontSize: 14 }} />
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                ({product.reviewCount})
                              </Text>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
                                {formatCurrency(product.price)}
                              </Text>
                              {product.originalPrice && product.originalPrice > product.price && (
                                <Text delete type="secondary" style={{ fontSize: 14 }}>
                                  {formatCurrency(product.originalPrice)}
                                </Text>
                              )}
                            </div>
                            
                            <div>
                              {product.stock > 0 ? (
                                <Text type="success" style={{ fontSize: 12 }}>
                                  Còn {product.stock} sản phẩm
                                </Text>
                              ) : (
                                <Text type="danger" style={{ fontSize: 12 }}>
                                  Hết hàng
                                </Text>
                              )}
                            </div>
                          </Space>
                        }
                      />
                    </Card>
                  </Col>
                ))}
              </Row>

              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: 32 }}>
                  <Button
                    type="primary"
                    size="large"
                    loading={loading}
                    onClick={loadMore}
                  >
                    {loading ? 'Đang tải...' : 'Xem thêm sản phẩm'}
                  </Button>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div style={{ textAlign: 'center', marginTop: 32, padding: 16 }}>
                  <Text type="secondary">Đã hiển thị tất cả sản phẩm</Text>
                </div>
              )}
            </>
          ) : (
            !loading && (
              <Empty 
                description="Không tìm thấy sản phẩm nào"
                style={{ marginTop: 48 }}
              />
            )
          )}
        </Spin>
      </Content>
    </Layout>
  );
};

export default ProductStore;