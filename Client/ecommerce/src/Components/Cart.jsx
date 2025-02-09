import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch cart items from the server
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('Please login to view your cart.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/orders`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data && Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          setError('Unexpected response format');
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to fetch cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle removing an item from the cart
  const handleRemoveItem = async (itemId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please login to modify your cart.');
        return;
      }

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/cart/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the cart items state by filtering out the removed item
      setCartItems((prevItems) =>
        prevItems.filter((item) => item._id !== itemId)
      );
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to remove item from cart');
    }
  };

  // Handle proceeding to checkout
  const handleCheckout = () => {
    navigate('/checkout'); // Redirect to checkout page
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cartItems.reduce((total, order) => total + order.total, 0).toFixed(2);
  };

  return (
    <Container>
      <h1 className="my-4">Your Cart</h1>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && cartItems.length === 0 && (
        <Alert variant="info">Your cart is empty.</Alert>
      )}

      {!loading && !error && cartItems.length > 0 && (
        <>
          <Row>
            {cartItems.map((order) => (
              <Col key={order._id} md={8} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>Order ID: {order._id}</Card.Title>
                    <Card.Text>Total: ${order.total.toFixed(2)}</Card.Text>
                    <Card.Text>Items:</Card.Text>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.product._id}>
                          {item.product.name} - ${item.product.price.toFixed(2)} (Qty: {item.quantity})
                          <Button
                            variant="danger"
                            size="sm"
                            className="ms-2"
                            onClick={() => handleRemoveItem(item.product._id)}
                          >
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <Row className="mt-4">
            <Col>
              <h4>Cart Total: ${calculateTotal()}</h4>
              <Button variant="success" onClick={handleCheckout}>
                Proceed to Checkout
              </Button>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Cart;