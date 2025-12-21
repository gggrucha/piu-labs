// siatka produktów
import './comp.js'; 

export class ProductList extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  set products(data) {
    this._products = data;
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          justify-items: center;
        }
      </style>
    `;

    this._products.forEach(product => {
      const card = document.createElement('product-card');
      card.price = product.price;

      let promoHTML = product.promo ? `<span slot="promo">${product.promo}</span>` : '';
      
      let sizesHTML = '';
      if (product.sizes && product.sizes.length > 0 && product.sizes[0] !== "") {
           sizesHTML = `<div slot="sizes">Rozmiary: ${product.sizes.join(', ')}</div>`;
      }

      let colorsHTML = '';
      if (product.colors && product.colors.length > 0) {
          const dots = product.colors.map(c => 
              `<span style="background:${c}; width:12px; height:12px; border-radius:50%; display:inline-block; border:1px solid #ccc;"></span>`
          ).join(' ');
          colorsHTML = `<div slot="colors">Dostępne: ${dots}</div>`;
      }

      card.innerHTML = `
          <img slot="image" src="${product.image}" alt="${product.name}">
          <span slot="name">${product.name}</span>
          ${promoHTML}
          ${sizesHTML}
          ${colorsHTML}
      `;

      this.shadowRoot.appendChild(card);
    });
  }
}

customElements.define('product-list', ProductList);