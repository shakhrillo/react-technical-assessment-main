import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getProducts();
      
      if (response.data.success) {
        setProducts(response.data.data.products || []);
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.searchProducts(searchQuery);
      
      if (response.data.success) {
        setProducts(response.data.data.products || []);
      } else {
        setError('Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Loading products...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Products</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-danger" onClick={fetchProducts}>
            Try Again
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center mb-4">Products</h1>
          
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="primary">
                Search
              </Button>
              {searchQuery && (
                <Button 
                  variant="outline-secondary"
                  onClick={() => {
                    setSearchQuery('');
                    fetchProducts();
                  }}
                >
                  Clear
                </Button>
              )}
            </InputGroup>
          </Form>
        </Col>
      </Row>

      {products.length === 0 ? (
        <Row>
          <Col>
            <Alert variant="info" className="text-center">
              {searchQuery ? 'No products found matching your search.' : 'No products available.'}
            </Alert>
          </Col>
        </Row>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3} className="mb-4">
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Products;