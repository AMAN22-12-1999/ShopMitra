import React from 'react';
import styled from 'styled-components';
import { ThemeConsumer } from '../context/ThemeContexts';

export default function CartColumns() {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Wrap $dark={theme} className="d-none d-lg-grid" role="row">
          <div>Products</div>
          <div>Name of Product</div>
          <div className="center">Price</div>
          <div className="center">Quantity</div>
          <div className="center">Remove</div>
          <div className="right">Total</div>
        </Wrap>
      )}
    </ThemeConsumer>
  );
}

/* ---------------- styled ---------------- */

const Wrap = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr 1fr 2fr 1fr 1.4fr; /* <-- match CartItem exactly */
  gap: 12px;
  align-items: center;
  padding: 14px 18px;
  margin: 6px 0 10px;
  border-radius: 12px;
  background: ${({ $dark }) => ($dark ? '#1f2937' : '#f1f5f9')};
  color: ${({ $dark }) => ($dark ? '#e5e7eb' : '#0f172a')};
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: .08em;
  font-size: .9rem;

  /* alignment to mirror the row cells */
  .center { text-align: center; }
  .right { text-align: right; }
`;
