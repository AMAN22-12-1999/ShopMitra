import React, { Component } from 'react';
import styled from 'styled-components';
import { ProductConsumer } from '../context';
import { ButtonContainer } from './Button';
import { Link } from 'react-router-dom';
import { ThemeConsumer } from './context/ThemeContexts';

export default class Modal extends Component {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {(value) => {
              const { modalOpen, closeModal } = value;
              const { img, title, price } = value.modalProduct;

              if (!modalOpen) return null;

              return (
                <Overlay>
                  <ModalCard $dark={theme}>
                    <h3 className="headline">Item Added to Cart</h3>
                    <ImageWrap>
                      <img src={img} alt={title} />
                    </ImageWrap>
                    <h4 className="product-title">{title}</h4>
                    <p className="price">
                      Price: <span>${price}</span>
                    </p>

                    <ButtonRow>
                      <Link to="/">
                        <StyledButton onClick={() => closeModal()} $dark={theme}>
                          Continue Shopping
                        </StyledButton>
                      </Link>

                      <Link to="/cart">
                        <StyledButton
                          cart
                          onClick={() => closeModal()}
                          $primary
                          $dark={theme}
                        >
                          Go To Cart
                        </StyledButton>
                      </Link>
                    </ButtonRow>
                  </ModalCard>
                </Overlay>
              );
            }}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}

/* ---------------- styled-components ---------------- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
`;

const ModalCard = styled.div`
  background: ${({ $dark }) => ($dark ? '#1e293b' : '#ffffff')};
  color: ${({ $dark }) => ($dark ? '#e2e8f0' : '#1e293b')};
  padding: 2.5rem 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  box-shadow: ${({ $dark }) =>
    $dark
      ? '0 20px 40px rgba(0,0,0,.6)'
      : '0 14px 36px rgba(0,0,0,.1)'};
  animation: slideUp 0.25s ease-out;

  .headline {
    font-weight: 700;
    font-size: 1.4rem;
    color: ${({ $dark }) => ($dark ? '#60a5fa' : '#1e40af')};
    margin-bottom: 1rem;
    letter-spacing: 0.5px;
  }

  .product-title {
    font-weight: 600;
    font-size: 1.1rem;
    margin-top: 0.8rem;
    margin-bottom: 0.2rem;
  }

  .price {
    font-size: 1rem;
    margin-bottom: 1.6rem;
    color: ${({ $dark }) => ($dark ? '#cbd5e1' : '#475569')};

    span {
      font-weight: 700;
      color: ${({ $dark }) => ($dark ? '#38bdf8' : '#1e40af')};
    }
  }

  @keyframes slideUp {
    from {
      transform: translateY(30px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem 0 0.8rem;

  img {
    max-width: 220px;
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const StyledButton = styled.button`
  background: ${({ $primary, $dark }) =>
    $primary
      ? $dark
        ? '#60a5fa'
        : '#2563eb'
      : 'transparent'};
  color: ${({ $primary, $dark }) =>
    $primary
      ? $dark
        ? '#0f172a'
        : '#ffffff'
      : $dark
      ? '#e2e8f0'
      : '#2563eb'};
  border: 2px solid
    ${({ $primary, $dark }) =>
      $primary
        ? $dark
          ? '#60a5fa'
          : '#2563eb'
        : $dark
        ? '#94a3b8'
        : '#2563eb'};
  border-radius: 8px;
  padding: 10px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: capitalize;

  &:hover {
    background: ${({ $primary, $dark }) =>
      $primary
        ? $dark
          ? '#93c5fd'
          : '#1d4ed8'
        : $dark
        ? 'rgba(148,163,184,0.15)'
        : 'rgba(37,99,235,0.08)'};
    transform: translateY(-2px);
  }
`;
