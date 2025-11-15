import React, { Component } from 'react';
import { ProductConsumer } from '../context';
import { Link } from 'react-router-dom';
import { ButtonContainer } from './Button';
import { ThemeConsumer } from './context/ThemeContexts';
import styled from 'styled-components';

export default class Details extends Component {
  render() {
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <ProductConsumer>
            {value => {
              const { id, company, img, info, price, title, inCart } = value.detailProduct;

              return (
                <Page $dark={theme}>
                  {/* Title */}
                  <Header>
                    <h1 className="title">
                      <span className="title-main">{title}</span>
                    </h1>
                  </Header>

                  {/* Content */}
                  <Content>
                    {/* Image */}
                    <ImageWrap>
                      <img src={img} alt={title} />
                    </ImageWrap>

                    {/* Text */}
                    <Info $dark={theme}>
                      <h2 className="model">Model: <span>{title}</span></h2>

                      <div className="maker">
                        <span className="label">Made by</span>
                        <span className="value">{company}</span>
                      </div>

                      <div className="price">
                        <span className="badge">${price}</span>
                        <span className="note">Inclusive of all taxes</span>
                      </div>

                      <div className="section">
                        <div className="headline">Some info about product</div>
                        <p className="copy">{info}</p>
                      </div>

                      {/* Buttons */}
                      <Actions>
                        <Link to="/">
                          <ButtonContainer>Back To Products</ButtonContainer>
                        </Link>

                        <ButtonContainer
                          cart
                          disabled={inCart ? true : false}
                          onClick={() => {
                            value.addToCart(id);
                            value.openModal(id);
                          }}
                        >
                          {inCart ? 'In Cart' : 'Add To Cart'}
                        </ButtonContainer>
                      </Actions>
                    </Info>
                  </Content>
                </Page>
              );
            }}
          </ProductConsumer>
        )}
      </ThemeConsumer>
    );
  }
}

/* ---------------- styled-components ---------------- */

const Page = styled.div`
  background: ${({ $dark }) => ($dark ? '#0f172a' : '#ffffff')};
  padding: 48px 0 64px;
  transition: background .25s ease;
`;

const Header = styled.div`
  max-width: 1200px;
  margin: 0 auto 28px;
  padding: 0 20px;
  text-align: center;

  .title {
    margin: 0;
    line-height: 1.2;
    letter-spacing: .5px;
  }
  .title-main {
    font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    font-weight: 700;
    font-size: clamp(28px, 4vw, 44px);
    background: linear-gradient(90deg, #1e3a8a 0%, #2563eb 60%, #22d3ee 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 36px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ImageWrap = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 10px 24px rgba(0,0,0,.08);
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    max-height: 520px;
    object-fit: contain;
    border-radius: 12px;
    transition: transform .25s ease;
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

const Info = styled.div`
  color: ${({ $dark }) => ($dark ? '#e5ecf4' : '#0f172a')};

  .model {
    font-family: 'Poppins', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    font-size: clamp(20px, 2.6vw, 30px);
    font-weight: 700;
    margin: 4px 0 8px;
  }
  .model span { opacity: .95; }

  .maker {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0 18px;
    text-transform: uppercase;
    letter-spacing: .35em;
    color: ${({ $dark }) => ($dark ? '#94a3b8' : '#64748b')};
    font-weight: 600;
  }
  .label { opacity: .8; }
  .value { color: ${({ $dark }) => ($dark ? '#cbd5e1' : '#334155')}; }

  .price {
    display: flex;
    align-items: center;
    gap: 14px;
    margin: 8px 0 22px;
  }
  .badge {
    display: inline-block;
    background: #0ea5a4;
    color: #071521;
    font-weight: 800;
    border-radius: 999px;
    padding: 8px 14px;
    box-shadow: 0 6px 16px rgba(14,165,164,.25);
  }
  .note {
    font-size: .9rem;
    color: ${({ $dark }) => ($dark ? '#9fb0c6' : '#64748b')};
  }

  .section { margin-top: 8px; }
  .headline {
    font-weight: 700;
    color: ${({ $dark }) => ($dark ? '#38bdf8' : '#1e3a8a')};
    margin-bottom: 6px;
  }
  .copy {
    line-height: 1.7;
    color: ${({ $dark }) => ($dark ? '#e5ecf4' : '#334155')};
    margin-bottom: 14px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;

  a { text-decoration: none; }
`;
