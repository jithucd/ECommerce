import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Spinner, Alert, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch product details from the server
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Handle adding the product to the cart
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        // Redirect to login if the user is not authenticated
        navigate('/login');
        return;
      }

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/cart/add`,
        { productId: id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Product added to cart!');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to add product to cart');
    }
  };

  return (
    <Container>
      <h1 className="my-4">Product Details</h1>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && product && (
        <Card>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>Price: ${product.price.toFixed(2)}</Card.Text>
            <Card.Text>Description: {product.description}</Card.Text>
            <Button variant="primary" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </Card.Body>
        </Card>
      )}

      {!loading && !error && !product && (
        <Alert variant="warning">Product not found.</Alert>
      )}
    </Container>
  );
};

export default ProductDetails;