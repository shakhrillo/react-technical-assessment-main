import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import { addToCart } from '../store/cartSlice';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to product detail
    dispatch(addToCart(product));
  };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <Card className="h-100 product-card" style={{ cursor: 'pointer' }} onClick={handleCardClick}>
      <Card.Img 
        variant="top" 
        src={product.image || '/placeholder-image.svg'} 
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = '/placeholder-image.svg';
        }}
      />
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h5">{product.name}</Card.Title>
        <Card.Text className="text-muted small flex-grow-1">
          {product.description}
        </Card.Text>
        <div className="mt-auto">
          <div className="h5 text-primary mb-3">${product.price?.toFixed(2)}</div>
          <Button 
            variant="primary" 
            className="w-100"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;