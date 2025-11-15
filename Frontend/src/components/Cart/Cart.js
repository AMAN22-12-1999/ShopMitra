import React, { Component } from 'react';
import Title from '../Title';
import CartColumns from './CartColumns';
import EmptyCart from './EmptyCart';
import { ProductConsumer } from '../../context';
import CartList from './CartList';
import CartTotals from './CartTotals';
import styled from 'styled-components';
import { ThemeConsumer } from '../context/ThemeContexts';

export default class Store extends Component {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <Page $dark={theme}>
            <ProductConsumer>
              {value => {
                const { cart } = value;
                if (cart.length > 0) {
                  return (
                    <>
                      <Header>
                        <Title name="Your" title="Cart" />
                      </Header>
                      <Content>
                        <CartColumns />
                        <CartList value={value} />
                        <CartTotals value={value} history={this.props.history} />
                      </Content>
                    </>
                  );
                } else {
                  return (
                    <Content>
                      <EmptyCart />
                    </Content>
                  );
                }
              }}
            </ProductConsumer>
          </Page>
        )}
      </ThemeConsumer>
    );
  }
}

/* ---------------- styled ---------------- */

const Page = styled.section`
  background: ${({ $dark }) => ($dark ? '#0f172a' : '#ffffff')};
  min-height: 100vh;
  transition: background .25s ease;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 20px 8px;
  text-align: center;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 8px 20px 64px;
`;
