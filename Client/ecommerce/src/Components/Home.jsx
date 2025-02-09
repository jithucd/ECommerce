import React from 'react';
import { Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
const Home = () => {
  return (
    <Container>
     
        <h1>Welcome to our e-commerce site!</h1>
        <p>Explore our wide range of products and enjoy a seamless shopping experience.</p>
        <p>
          <Button variant="primary" href="/products">Shop Now</Button>
        </p>
     
    </Container>
  );
};

export default Home;