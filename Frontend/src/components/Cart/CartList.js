import React from 'react';
import CartItem from './CartItem';
import styled from 'styled-components';

export default function CartList({ value }) {
  const { cart } = value;

  return (
    <List>
      {cart.map(item => (
        <CartItem key={item.id} item={item} value={value} />
      ))}
    </List>
  );
}

/* ---------------- styled ---------------- */

const List = styled.div`
  width: 100%;
`;
