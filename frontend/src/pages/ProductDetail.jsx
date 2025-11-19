import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Row, Col, Button, Spinner, Alert, Form, Card } from 'react-bootstrap';
import { productAPI } from '../services/api';
import { addToCart } from '../store/cartSlice';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productAPI.getProduct(id);
      
      if (response.data.success) {
        setProduct(response.data.data.product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        dispatch(addToCart(product));
      }
      // Show success message or notification here if desired
    }
  };

  const handleGoBack = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Loading product...</span>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Product</Alert.Heading>
          <p>{error || 'Product not found'}</p>
          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-danger" onClick={fetchProduct}>
              Try Again
            </Button>
            <Button variant="primary" onClick={handleGoBack}>
              Back to Products
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-primary" 
        className="mb-4" 
        onClick={handleGoBack}
      >
        ← Back to Products
      </Button>

      <Row>
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Img
              variant="top"
              src={product.image || '/placeholder-image.svg'} 
              alt={product.name}
              style={{ height: '400px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/placeholder-image.svg';
              }}
            />
          </Card>
        </Col>

        <Col lg={6}>
          <div className="h-100 d-flex flex-column">
            <h1 className="display-5 mb-3">{product.name}</h1>
            
            <div className="h3 text-primary mb-4">
              ${product.price?.toFixed(2)}
            </div>

            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">Description</h5>
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{product.description || 'No description available.'}</p>
              </Card.Body>
            </Card>

            {product.category && (
              <div className="mb-4">
                <strong>Category:</strong> 
                <span className="ms-2 badge bg-secondary">{product.category}</span>
              </div>
            )}

            <Card className="mt-auto">
              <Card.Body>
                <Row className="align-items-center">
                  <Col xs="auto">
                    <Form.Label htmlFor="quantity" className="col-form-label">
                      Quantity:
                    </Form.Label>
                  </Col>
                  <Col xs="auto">
                    <Form.Select 
                      id="quantity"
                      value={quantity} 
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      style={{ width: '80px' }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                  <Col>
                    <Button 
                      variant="primary"
                      size="lg"
                      className="w-100"
                      onClick={handleAddToCart}
                    >
                      Add to Cart
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;