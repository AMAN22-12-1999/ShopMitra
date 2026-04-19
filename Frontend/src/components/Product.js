import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ProductConsumer } from '../context';
import PropTypes from 'prop-types';
import { ThemeConsumer } from './context/ThemeContexts';

export default class Product extends Component {
  render() {
    const { id, title, img, price, inCart } = this.props.product;
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {value => (
              <Card $dark={theme}>
                <ImageWrap onClick={() => value.handleDetail(id)}>
                  <Link to="/details">
                    <img src={img} alt={title} />
                  </Link>

                  <CartBtn
                    aria-label={inCart ? 'In Cart' : 'Add to cart'}
                    disabled={inCart}
                    onClick={(e) => {
                      e.stopPropagation();
                      value.addToCart(id);
                      value.openModal(id);
                    }}
                    $dark={theme}
                  >
                    {inCart ? 'In Cart' : <i className="fas fa-cart-plus" />}
                  </CartBtn>
                </ImageWrap>

                <Footer $dark={theme}>
                  <Title>{title}</Title>
                  <Price>
                    ₹{Number(price).toFixed(2)}
                  </Price>
                </Footer>
              </Card>
            )}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}

Product.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    img: PropTypes.string,
    title: PropTypes.string,
    price: PropTypes.number,
    inCart: PropTypes.bool
  }).isRequired
};

/* ------------ styled-components ------------ */

const Card = styled.article`
  background: ${({ $dark }) => ($dark ? '#1e293b' : '#ffffff')};
  border-radius: 16px;
  box-shadow: 0 8px 18px rgba(0,0,0,.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform .18s ease, box-shadow .2s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 28px rgba(0,0,0,.12);
  }
`;

const ImageWrap = styled.div`
  position: relative;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-height: 220px;
    object-fit: contain;
    transition: transform .25s ease;
  }
  &:hover img { transform: scale(1.03); }
`;

const CartBtn = styled.button`
  position: absolute;
  right: 14px;
  font-size:11px;
  bottom: 14px;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  border: none;
  background: ${({ $dark }) => ($dark ? '#60a5fa' : '#2563eb')};
  color: #0b1220;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
  box-shadow: 0 10px 22px rgba(37, 99, 235, .25);
  transition: transform .12s ease, box-shadow .2s ease;

  &:hover { transform: translateY(-1px); }
`;

const Footer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: 12px;
  padding: 10px 16px 16px;
  color: ${({ $dark }) => ($dark ? '#e5ecf4' : '#0f172a')};
`;

const Title = styled.p`
  margin: 0;
  font-weight: 600;
  line-height: 1.35;
`;

const Price = styled.h5`
  margin: 0;
  font-weight: 800;
  letter-spacing: .4px;
  span { margin-right: 2px; opacity: .7; }
`;
