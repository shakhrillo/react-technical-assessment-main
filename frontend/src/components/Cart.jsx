import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ButtonGroup, Alert } from 'react-bootstrap';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import '../styles/Cart.css';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalAmount } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQuantity({ productId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center">
              <Card.Body className="py-5">
                <h2 className="mb-4">Shopping Cart</h2>
                <Alert variant="info">
                  <h5>Your cart is empty</h5>
                  <p>Start shopping to add items to your cart!</p>
                </Alert>
                <Button as={Link} to="/products" variant="primary" size="lg">
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              Shopping Cart <Badge bg="primary">{totalQuantity} items</Badge>
            </h2>
            <Button variant="outline-danger" onClick={handleClearCart}>
              Clear Cart
            </Button>
          </div>

          <Row>
            <Col lg={8}>
              {items.map((item) => (
                <Card key={item.id} className="mb-3">
                  <Card.Body>
                    <Row className="align-items-center">
                      <Col xs={3} md={2}>
                        <img 
                          src={item.image || '/placeholder-image.svg'} 
                          alt={item.name}
                          className="img-fluid rounded"
                          style={{ height: '80px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.svg';
                          }}
                        />
                      </Col>
                      
                      <Col xs={9} md={4}>
                        <h5 className="mb-1">{item.name}</h5>
                        <div className="text-primary fw-bold">${item.price?.toFixed(2)}</div>
                      </Col>

                      <Col xs={6} md={3} className="text-center">
                        <ButtonGroup size="sm">
                          <Button 
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </Button>
                          <Button variant="outline-primary" disabled>
                            {item.quantity}
                          </Button>
                          <Button 
                            variant="outline-secondary"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </Col>

                      <Col xs={4} md={2} className="text-center">
                        <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                      </Col>

                      <Col xs={2} md={1} className="text-center">
                        <Button 
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id)}
                          title="Remove item"
                        >
                          ×
                        </Button>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col lg={4}>
              <Card className="sticky-top">
                <Card.Header>
                  <h4>Order Summary</h4>
                </Card.Header>
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Items:</span>
                    <span>{totalQuantity}</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <strong>Total Amount:</strong>
                    <strong className="text-primary">${totalAmount.toFixed(2)}</strong>
                  </div>
                  
                  <div className="d-grid">
                    <Button variant="primary" size="lg">
                      Proceed to Checkout
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;