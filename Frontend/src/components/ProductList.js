import React from 'react';
import Product from './Product';
import Title from './Title';
import { ProductConsumer } from '../context';
import { ThemeConsumer } from './context/ThemeContexts';
import Loader from './Loader';
import styled from 'styled-components';

class ProductList extends React.Component {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {(value) => (
              <Section $dark={theme}>
                <Inner>
                  <Header>
                    <Title name="Our" title="Products" />
                  </Header>

                  {value.loading && value.products.length === 0 ? (
                    <Loader />
                  ) : (
                    <>
                      {value.products.length > 0 ? (
                        <Grid>
                          {value.products.map((product) => (
                            <Product key={product.id} product={product} />
                          ))}
                        </Grid>
                      ) : (
                        <Empty>
                          <p className="oops">Sorry, no results found!</p>
                          <p className="hint">Please check the spelling or try searching for something else.</p>
                        </Empty>
                      )}

                      {value.loading && <Loader />}

                      <LoadMoreWrap>
                        {value.currentPage < (value.totalPages || 0) ? (
                          <LoadMore
                            onClick={() => value.loadMore()}
                            disabled={value.loading}
                            $dark={theme}
                          >
                            {value.loading ? 'Loading…' : 'Load more'}
                          </LoadMore>
                        ) : (
                          value.products.length > 0 && (
                            <NoMore $dark={theme}>No more products</NoMore>
                          )
                        )}
                      </LoadMoreWrap>
                    </>
                  )}
                </Inner>
              </Section>
            )}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}

export default ProductList;

/* ------------ styled-components ------------ */

const Section = styled.section`
  background: ${({ $dark }) => ($dark ? '#0f172a' : '#e5ebf1')};
  padding: 36px 0 64px;
  transition: background .25s ease;
`;

const Inner = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 18px;
`;

const Grid = styled.div`
  display: grid;
  /* Automatically fits as many 260px columns as possible, expanding to fill space */
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  justify-items: center;
`;

const Empty = styled.div`
  text-align: center;
  padding: 36px 0 12px;

  .oops {
    color: #ef4444;
    font-weight: 700;
    margin: 0 0 6px;
  }
  .hint {
    color: #475569;
    margin: 0;
  }
`;

const LoadMoreWrap = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const LoadMore = styled.button`
  background: ${({ $dark }) => ($dark ? '#60a5fa' : '#2563eb')};
  color: #0b1220;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-weight: 700;
  letter-spacing: .3px;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(37, 99, 235, .25);
  transition: transform .15s ease, background .2s ease, box-shadow .2s ease;

  &:hover { transform: translateY(-1px); }
  &:disabled { opacity: .7; cursor: default; }
`;

const NoMore = styled.p`
  color: ${({ $dark }) => ($dark ? '#cbd5e1' : '#334155')};
  margin: 0;
`;
