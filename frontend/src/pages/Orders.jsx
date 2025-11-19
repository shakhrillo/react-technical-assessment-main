import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Spinner, Alert, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // For now, we'll show mock data since the API endpoint might need authentication
    // In a real app, you would fetch from /api/orders
    const mockOrders = [
      {
        id: 'order-1',
        createdAt: '2024-02-01T10:00:00.000Z',
        status: 'delivered',
        total: 1311.97,
        items: [
          { name: 'iPhone 15 Pro', quantity: 1, price: 999.99 },
          { name: 'Wireless Headphones Pro', quantity: 1, price: 199.99 }
        ],
        deliveredAt: '2024-02-05T10:00:00.000Z'
      },
      {
        id: 'order-2',
        createdAt: '2024-02-10T10:00:00.000Z',
        status: 'shipped',
        total: 270.17,
        items: [
          { name: 'Nike Air Max 90', quantity: 2, price: 119.99 }
        ],
        shippedAt: '2024-02-12T10:00:00.000Z'
      },
      {
        id: 'order-3',
        createdAt: '2024-02-15T10:00:00.000Z',
        status: 'pending',
        total: 91.27,
        items: [
          { name: 'The Great Gatsby', quantity: 3, price: 12.99 },
          { name: 'Yoga Mat Premium', quantity: 1, price: 39.99 }
        ]
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      setOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusVariant = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'processing':
        return 'fas fa-cog fa-spin';
      case 'shipped':
        return 'fas fa-shipping-fast';
      case 'delivered':
        return 'fas fa-check-circle';
      case 'cancelled':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status" className="me-2" />
        <span>Loading orders...</span>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <Alert.Heading>Error Loading Orders</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  if (orders.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="text-center">
              <Card.Body className="py-5">
                <i className="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                <h3 className="mb-3">No Orders Yet</h3>
                <p className="text-muted mb-4">
                  You haven't placed any orders yet. Start shopping to see your order history!
                </p>
                <Button as={Link} to="/products" variant="primary" size="lg">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Start Shopping
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
              <i className="fas fa-history me-2"></i>
              Order History
            </h2>
            <Badge bg="primary" className="fs-6">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </Badge>
          </div>

          <Row>
            {orders.map((order) => (
              <Col key={order.id} lg={12} className="mb-4">
                <Card className="h-100">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">Order #{order.id}</h5>
                      <small className="text-muted">
                        Placed on {formatDate(order.createdAt)}
                      </small>
                    </div>
                    <Badge 
                      bg={getStatusVariant(order.status)} 
                      className="d-flex align-items-center"
                    >
                      <i className={`${getStatusIcon(order.status)} me-2`}></i>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </Card.Header>

                  <Card.Body>
                    <Row>
                      <Col md={8}>
                        <h6 className="mb-3">Items Ordered:</h6>
                        <Table size="sm" className="mb-0">
                          <tbody>
                            {order.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.name}</td>
                                <td className="text-center">Qty: {item.quantity}</td>
                                <td className="text-end">${item.price.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>

                      <Col md={4}>
                        <div className="bg-light p-3 rounded">
                          <div className="d-flex justify-content-between mb-2">
                            <strong>Total:</strong>
                            <strong className="text-primary">
                              ${order.total.toFixed(2)}
                            </strong>
                          </div>
                          
                          {order.status === 'delivered' && order.deliveredAt && (
                            <div className="text-success small">
                              <i className="fas fa-check me-1"></i>
                              Delivered on {formatDate(order.deliveredAt)}
                            </div>
                          )}
                          
                          {order.status === 'shipped' && order.shippedAt && (
                            <div className="text-info small">
                              <i className="fas fa-truck me-1"></i>
                              Shipped on {formatDate(order.shippedAt)}
                            </div>
                          )}
                          
                          {order.status === 'pending' && (
                            <div className="text-warning small">
                              <i className="fas fa-clock me-1"></i>
                              Processing your order...
                            </div>
                          )}
                        </div>

                        <div className="mt-3 d-grid gap-2">
                          <Button variant="outline-primary" size="sm">
                            <i className="fas fa-eye me-1"></i>
                            View Details
                          </Button>
                          
                          {order.status === 'delivered' && (
                            <Button variant="outline-secondary" size="sm">
                              <i className="fas fa-redo me-1"></i>
                              Reorder
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-4">
            <Button as={Link} to="/products" variant="primary">
              <i className="fas fa-shopping-cart me-2"></i>
              Continue Shopping
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Orders;