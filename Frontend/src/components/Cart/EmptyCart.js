import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonContainer } from '../Button';
import styled from 'styled-components';
import { ThemeConsumer } from '../context/ThemeContexts';

export default function EmptyCart() {
  return (
    <ThemeConsumer>
      {({ theme }) => (
        <Wrap $dark={theme}>
          <h2>Your cart is currently empty</h2>
          <Link to="/">
            <ButtonContainer>Back to Shopping</ButtonContainer>
          </Link>
        </Wrap>
      )}
    </ThemeConsumer>
  );
}

/* ---------------- styled ---------------- */

const Wrap = styled.div`
  text-align: center;
  padding: 48px 12px 24px;

  h2 {
    font-weight: 800;
    margin-bottom: 12px;
    letter-spacing: 0.3px;
    color: ${({ $dark }) => ($dark ? '#e2e8f0' : '#1e293b')};
    transition: color 0.3s ease;
  }
`;
