import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { ButtonContainer } from './Button';
import { ThemeContext } from './context/ThemeContexts';
import { FaRegMoon } from 'react-icons/fa';
import { GoSun } from 'react-icons/go';
import { AiOutlineMenu } from 'react-icons/ai';
import { FiSearch } from 'react-icons/fi';
import { ProductConsumer } from '../context';
import logoDark from '../assets/logo/shopmitra.png';

class Navbar extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      isMobile: typeof window !== 'undefined' ? window.innerWidth <= 768 : true,
      menuOpen: false,
      searchValue: ''
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ isMobile: window.innerWidth <= 768 });
  };

  handleMenu = () => {
    this.setState(prev => ({ menuOpen: !prev.menuOpen }));
  };

  handleSearchChange = (e, filterFn) => {
    const val = e.target.value;
    this.setState({ searchValue: val });
    filterFn(val);
  };

  render() {
    const { theme, toggleTheme } = this.context;
    const { isMobile, menuOpen, searchValue } = this.state;

    return (
      <NavRoot themeMode={theme ? 'dark' : 'light'}>
        <NavBar>
          {/* Left: Logo */}
          <Left>
            <Link to="/" className="brand">
              <Logo src={logoDark} alt="ShopMitra"/>
              <BrandText>ShopMitra</BrandText>
            </Link>
          </Left>

          {/* Center: Search (desktop) */}
          {!isMobile && (
            <Center>
              <ProductConsumer>
                {value => (
                  <SearchBox role="search" aria-label="Search products">
                    <FiSearch className="icon" />
                    <input
                      value={searchValue}
                      onChange={(e) => this.handleSearchChange(e, value.filterProducts)}
                      placeholder="Search for products"
                    />
                  </SearchBox>
                )}
              </ProductConsumer>
            </Center>
          )}

          {/* Right: Cart + Theme + Mobile Menu Button */}
          <Right>
            <Link to="/cart" className="cart">
              <ButtonContainer>
                <i className="fas fa-cart-plus" />&nbsp;My Cart
              </ButtonContainer>
            </Link>

            <ThemeToggle onClick={toggleTheme} title="Toggle theme" aria-label="Toggle theme">
              {theme ? <FaRegMoon /> : <GoSun />}
            </ThemeToggle>

            {isMobile && (
              <MenuButton onClick={this.handleMenu} aria-expanded={menuOpen} aria-label="Toggle menu">
                <AiOutlineMenu />
              </MenuButton>
            )}
          </Right>
        </NavBar>

        {/* Mobile dropdown */}
        {isMobile && (
          <MobilePanel open={menuOpen}>
            <ProductConsumer>
              {value => (
                <SearchBox role="search" aria-label="Search products">
                  <FiSearch className="icon" />
                  <input
                    value={searchValue}
                    onChange={(e) => this.handleSearchChange(e, value.filterProducts)}
                    placeholder="Search for products"
                  />
                </SearchBox>
              )}
            </ProductConsumer>

            <MobileActions>
              <Link to="/cart" onClick={() => this.setState({ menuOpen: false })}>
                <ButtonContainer>
                  <i className="fas fa-cart-plus" />&nbsp;My Cart
                </ButtonContainer>
              </Link>
              <SmallNote>Happy shopping with ShopMitra ✨</SmallNote>
            </MobileActions>
          </MobilePanel>
        )}
      </NavRoot>
    );
  }
}

export default Navbar;

/* ===================== styled-components ===================== */

const colors = {
  light: {
    nav: '#273244',       // header background
    border: '#3b475b',
    text: '#e5ecf4',
    textMuted: '#b7c1d1',
    inputBg: '#ffffff',
    inputText: '#0f172a',
    ring: '#60a5fa'
  },
  dark: {
    nav: '#1f2937',
    border: '#334155',
    text: '#e5ecf4',
    textMuted: '#9fb0c6',
    inputBg: '#111827',
    inputText: '#e5ecf4',
    ring: '#22d3ee'
  }
};

const NavRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 60;
  background: ${({ themeMode }) => colors[themeMode].nav};
  border-bottom: 1px solid ${({ themeMode }) => colors[themeMode].border};
  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
`;

const NavBar = styled.nav`
  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 20px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr auto auto;
  }
`;

const Left = styled.div`
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
`;

const Logo = styled.img`
  height: 40px;
  width: auto;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.25);
  transition: transform .2s ease;
  &:hover { transform: translateY(-1px); }
`;

const BrandText = styled.span`
  font-weight: 700;
  letter-spacing: .4px;
  color: #e5ecf4;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;

  .cart { text-decoration: none; }
`;

const ringStyles = css`
  box-shadow: 0 0 0 3px var(--ringColor);
`;

const SearchBox = styled.div`
  --ringColor: ${({ theme }) => 'transparent'};
  position: relative;
  display: inline-flex;
  align-items: center;
  width: min(520px, 90vw);
  background: ${({ theme }) => colors[theme?.theme ? 'dark' : 'light'].inputBg};
  color: ${({ theme }) => colors[theme?.theme ? 'dark' : 'light'].inputText};
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 999px;
  padding: 8px 14px 8px 40px;
  transition: box-shadow .2s ease, border-color .2s ease;

  .icon {
    position: absolute;
    left: 14px;
    font-size: 18px;
    color: ${({ theme }) => colors[theme?.theme ? 'dark' : 'light'].textMuted};
  }

  input {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: inherit;
    font-size: 0.95rem;
    letter-spacing: .2px;
  }

  &:focus-within {
    border-color: ${({ theme }) => colors[theme?.theme ? 'dark' : 'light'].ring};
    ${ringStyles};
    --ringColor: ${({ theme }) => colors[theme?.theme ? 'dark' : 'light'].ring}33;
  }
`;

const ThemeToggle = styled.button`
  border: none;
  background: transparent;
  color: #e5ecf4;
  font-size: 1.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  cursor: pointer;
  transition: background .2s ease, transform .2s ease;

  &:hover { background: rgba(255,255,255,.08); transform: translateY(-1px); }
  &:active { transform: translateY(0); }
`;

const MenuButton = styled.button`
  border: none;
  background: transparent;
  color: #e5ecf4;
  font-size: 1.55rem;
  width: 40px; height: 40px;
  border-radius: 10px;
  cursor: pointer;
  transition: background .2s ease;
  &:hover { background: rgba(255,255,255,.08); }
`;

const MobilePanel = styled.div`
  max-height: ${props => (props.open ? '240px' : '0')};
  overflow: hidden;
  transition: max-height .28s ease;
  padding: ${props => (props.open ? '10px 16px 14px' : '0 16px')};

  > * { margin-top: 10px; }
`;

const MobileActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SmallNote = styled.span`
  color: rgba(255,255,255,.7);
  font-size: .85rem;
`;
