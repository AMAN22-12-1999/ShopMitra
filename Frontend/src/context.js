import React, { Component } from "react";
import { detailProduct as initialDetail } from "./data";
const ProductContext = React.createContext();

class ProductProvider extends Component {
  state = {
    products: [],
    detailProduct: initialDetail,
    cart: [],
    modalOpen: false,
    modalProduct: initialDetail,
    cartSubTotal: 0,
    cartTax: 0,
    cartTotal: 0,
    loading: false,
    currentPage: 1,
    perPage: 12,
    totalPages: null,
    query: ''
  };

  componentDidMount() {
    this.fetchProducts(1);
  }

  fetchProducts = async (page = 1, q = '') => {
    try {
      this.setState({ loading: true });
      const res = await fetch(`/api/products?page=${page}&limit=${this.state.perPage}&q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Network error');
      const data = await res.json(); // { products, page, totalPages }
      const received = data.products.map(p => ({ ...p })); // copy for safe local mutation
      this.setState(prev => ({
        products: page === 1 ? received : [...prev.products, ...received],
        currentPage: data.page,
        totalPages: data.totalPages,
        query: q,
        loading: false
      }), this.checkCartItems);
    } catch (e) {
      console.error('fetchProducts error', e);
      this.setState({ loading: false });
    }
  };

  filterProducts = (value) => {
    const q = (value || '').toLowerCase();
    this.fetchProducts(1, q); // new search resets to first page
  }

  loadMore = () => {
    const { currentPage, totalPages, query } = this.state;
    if (totalPages && currentPage >= totalPages) return;
    this.fetchProducts(currentPage + 1, query);
  }

  getItem = id => {
    return this.state.products.find(item => item.id === id);
  };

  handleDetail = id => {
    const product = this.getItem(id);
    if (product) this.setState({ detailProduct: product });
  };

  addToCart = id => {
    let tempProducts = [...this.state.products];
    const index = tempProducts.findIndex(item => item.id === id);
    if (index === -1) return;
    const product = { ...tempProducts[index] };
    product.inCart = true;
    product.count = 1;
    product.total = product.price;
    tempProducts[index] = product;

    this.setState(prev => ({
      products: tempProducts,
      cart: [...prev.cart, product],
      detailProduct: { ...product }
    }), this.addTotals);
  };

  openModal = id => {
    const product = this.getItem(id);
    this.setState({ modalProduct: product, modalOpen: true });
  };

  closeModal = () => this.setState({ modalOpen: false });

  increment = id => {
    let tempCart = [...this.state.cart];
    const index = tempCart.findIndex(item => item.id === id);
    if (index === -1) return;
    const product = { ...tempCart[index] };
    product.count += 1;
    product.total = product.count * product.price;
    tempCart[index] = product;
    this.setState({ cart: tempCart }, this.addTotals);
  };

  decrement = id => {
    let tempCart = [...this.state.cart];
    const index = tempCart.findIndex(item => item.id === id);
    if (index === -1) return;
    const product = { ...tempCart[index] };
    product.count -= 1;
    if (product.count <= 0) {
      this.removeItem(id);
    } else {
      product.total = product.count * product.price;
      tempCart[index] = product;
      this.setState({ cart: tempCart }, this.addTotals);
    }
  };

  getTotals = () => {
    let subTotal = 0;
    this.state.cart.forEach(item => (subTotal += item.total));
    const tempTax = subTotal * 0.1;
    const tax = parseFloat(tempTax.toFixed(2));
    const total = subTotal + tax;
    return { subTotal, tax, total };
  };

  addTotals = () => {
    const totals = this.getTotals();
    this.setState({
      cartSubTotal: totals.subTotal,
      cartTax: totals.tax,
      cartTotal: totals.total
    });
  };

  removeItem = id => {
    let tempProducts = [...this.state.products];
    let tempCart = [...this.state.cart];

    const prodIndex = tempProducts.findIndex(p => p.id === id);
    if (prodIndex !== -1) {
      const removedProduct = { ...tempProducts[prodIndex] };
      removedProduct.inCart = false;
      removedProduct.count = 0;
      removedProduct.total = 0;
      tempProducts[prodIndex] = removedProduct;
    }

    tempCart = tempCart.filter(item => item.id !== id);

    this.setState({
      cart: tempCart,
      products: tempProducts
    }, this.addTotals);
  };

  clearCart = () => {
    this.setState({ cart: [] }, () => {
      const cleared = this.state.products.map(p => ({ ...p, inCart: false, count: 0, total: 0 }));
      this.setState({ products: cleared }, this.addTotals);
    });
  };

  checkCartItems = () => {
    const cartIds = this.state.cart.map(i => i.id);
    if (cartIds.length === 0) return;
    const products = this.state.products.map(p => {
      if (cartIds.includes(p.id)) {
        const cartItem = this.state.cart.find(c => c.id === p.id);
        return { ...p, inCart: true, count: cartItem.count, total: cartItem.total };
      }
      return p;
    });
    this.setState({ products });
  };

  render() {
    return (
      <ProductContext.Provider
        value={{
          ...this.state,
          handleDetail: this.handleDetail,
          addToCart: this.addToCart,
          openModal: this.openModal,
          closeModal: this.closeModal,
          increment: this.increment,
          decrement: this.decrement,
          removeItem: this.removeItem,
          clearCart: this.clearCart,
          filterProducts: this.filterProducts,
          loadMore: this.loadMore,
          fetchProducts: this.fetchProducts
        }}
      >
        {this.props.children}
      </ProductContext.Provider>
    );
  }
}

const ProductConsumer = ProductContext.Consumer;
export { ProductProvider, ProductConsumer };
