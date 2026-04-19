// Frontend/src/components/Cart/CartTotals.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ThemeConsumer } from '../context/ThemeContexts';
import styled from 'styled-components';
import CheckoutModal from './CheckoutModal';

const money = n => Number(n || 0).toFixed(2);

export default function CartTotals({ value }) {
  const { cartSubTotal, cartTax, cartTotal, clearCart } = value;
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Wrap>
          <Actions>
            <Link to="/">
              <Button
                $variant="danger"
                onClick={() => clearCart()}
                aria-label="Clear cart"
                $dark={theme}
              >
                Clear Cart
              </Button>
            </Link>

            <ProceedButton
              onClick={() => setCheckoutOpen(true)}
              $dark={theme}
              aria-label="Proceed to buy"
            >
              Proceed with Buy
            </ProceedButton>
          </Actions>

          <Summary $dark={theme}>
            <Row>
              <Label $dark={theme}>Subtotal</Label>
              <Value>₹{money(cartSubTotal)}</Value>
            </Row>
            <Row>
              <Label $dark={theme}>Tax</Label>
              <Value>₹{money(cartTax)}</Value>
            </Row>
            <Divider />
            <Row $total>
              <Label $dark={theme}>Total</Label>
              <Total $dark={theme}>₹{money(cartTotal)}</Total>
            </Row>
          </Summary>

          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            value={value}
          />
        </Wrap>
      )}
    </ThemeConsumer>
  );
}

/* ---------------- styled ---------------- */

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 18px;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 360px;
    align-items: start;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  align-items: center;
`;

const Button = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  border: 2px solid
    ${({ $variant }) => ($variant === 'danger' ? '#ef4444' : '#2563eb')};
  background: transparent;
  color: ${({ $variant }) => ($variant === 'danger' ? '#ef4444' : '#2563eb')};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  cursor: pointer;
  transition: all .2s ease;

  &:hover {
    background: ${({ $variant }) => ($variant === 'danger' ? '#ef4444' : '#2563eb')};
    color: #ffffff;
    transform: translateY(-1px);
  }
`;

const ProceedButton = styled.button`
  padding: 10px 18px;
  border-radius: 10px;
  border: 2px solid ${({ $dark }) => ($dark ? '#60a5fa' : '#2563eb')};
  background: ${({ $dark }) => ($dark ? '#60a5fa' : '#2563eb')};
  color: ${({ $dark }) => ($dark ? '#0b1220' : '#ffffff')};
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .06em;
  cursor: pointer;
  transition: all .2s ease;
  &:hover { transform: translateY(-1px); opacity: .95; }
`;

const Summary = styled.div`
  background: ${({ $dark }) => ($dark ? '#111827' : '#ffffff')};
  color: ${({ $dark }) => ($dark ? '#e5e7eb' : '#0f172a')};
  border-radius: 14px;
  padding: 18px 18px 14px;
  box-shadow: ${({ $dark }) =>
    $dark ? '0 12px 24px rgba(0,0,0,.35)' : '0 10px 18px rgba(0,0,0,.08)'}};
  min-width: 280px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 2px;
  align-items: baseline;

  ${({ $total }) =>
    $total &&
    `
    padding-top: 12px;
  `}
`;

 const Label = styled.span`
   font-weight: 700;
   letter-spacing: .08em;
   text-transform: uppercase;
   color: ${({ $dark }) => ($dark ? '#9fb0c6' : '#64748b')};
`;

const Value = styled.span`
  font-weight: 800;
  letter-spacing: .02em;
`;

const Total = styled(Value)`
font-size: 1.25rem;
   color: ${({ $dark }) => ($dark ? '#93c5fd' : '#1e40af')};
`;

const Divider = styled.hr`
  border: none;
  height: 1px;
  margin: 10px 0 8px;
  background: rgba(148,163,184,.35);
`;
