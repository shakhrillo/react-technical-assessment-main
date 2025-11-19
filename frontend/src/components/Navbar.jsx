import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container, Badge, Button, Dropdown } from 'react-bootstrap';
import { logout } from '../store/authSlice';
import '../styles/Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActiveRoute = (path) => location.pathname === path;

  const getUserDisplayName = () => {
    return user?.name || user?.email?.split('@')[0] || 'User';
  };

  return (
    <BSNavbar 
      bg="white" 
      variant="light" 
      expand="lg" 
      className="custom-navbar shadow-sm"
      sticky="top"
    >
      <Container>
        <BSNavbar.Brand 
          as={Link} 
          to="/" 
          className="brand-logo fw-bold"
          aria-label="Marketplace Home"
        >
          <span className="brand-icon">�️</span>
          <span className="brand-text">Marketplace</span>
        </BSNavbar.Brand>

        <BSNavbar.Toggle 
          aria-controls="basic-navbar-nav"
          className="border-0"
        />
        
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center">
            {isAuthenticated ? (
              <>
                <Nav.Link 
                  as={Link} 
                  to="/products"
                  className={`nav-link-custom ${isActiveRoute('/products') ? 'active' : ''}`}
                >
                  <i className="fas fa-box me-1"></i>
                  Products
                </Nav.Link>
                
                <Nav.Link 
                  as={Link} 
                  to="/cart" 
                  className={`cart-link-custom position-relative ${isActiveRoute('/cart') ? 'active' : ''}`}
                >
                  <i className="fas fa-shopping-cart me-1"></i>
                  Cart
                  {totalQuantity > 0 && (
                    <Badge 
                      pill 
                      bg="danger" 
                      className="cart-badge position-absolute"
                    >
                      {totalQuantity > 99 ? '99+' : totalQuantity}
                    </Badge>
                  )}
                </Nav.Link>

                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle 
                    variant="outline-primary" 
                    id="user-dropdown"
                    className="user-toggle d-flex align-items-center"
                  >
                    <div className="user-avatar me-2">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <span className="d-none d-lg-inline">{getUserDisplayName()}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>
                      <div className="text-center">
                        <div className="user-avatar-large mb-2">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </div>
                        <div className="fw-bold">{getUserDisplayName()}</div>
                        <small className="text-muted">{user?.email}</small>
                      </div>
                    </Dropdown.Header>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fas fa-user me-2"></i>
                      Profile
                    </Dropdown.Item>
                    
                    <Dropdown.Item as={Link} to="/orders">
                      <i className="fas fa-history me-2"></i>
                      Order History
                    </Dropdown.Item>
                    
                    <Dropdown.Divider />
                    
                    <Dropdown.Item 
                      onClick={handleLogout}
                      className="text-danger"
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Nav.Link 
                as={Link} 
                to="/login"
                className="login-link-custom"
              >
                <i className="fas fa-sign-in-alt me-1"></i>
                Login
              </Nav.Link>
            )}
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
};

export default Navbar;