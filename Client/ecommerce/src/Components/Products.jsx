import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          setError('Unexpected response format');
        }
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch products');
      })
      .finally(() => setLoading(false));
  }, []);
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      setProducts(products.filter(product => product._id !== id));
    } catch (err) {
      console.error(err);
      setError('Failed to delete product');
    }
  };

  return (
    <Container>
      <h1 className="my-4">Products</h1>
      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {products.map(product => (
          <Col key={product._id} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
                <Card.Text>{product.description}</Card.Text>
                <Link to={`/products/${product._id}`} className="btn btn-primary me-2">
                  View Details
                </Link>
                <Button variant="danger" onClick={() => handleDelete(product._id)}>
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;