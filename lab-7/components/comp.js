// W tym pliku jest logika tworzenia pojedynczej karty produktu
const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      width: 300px;
      background-color: #ffffff;
      border: 1px solid #eaeaea;
      border-radius: 12px;
      overflow: hidden;
      font-family: 'Segoe UI', sans-serif;
      box-shadow: 0 4px 6px rgba(0,0,0,0.05);
      transition: transform 0.2s, box-shadow 0.2s;
      margin: 10px;
    }

    :host(:hover) {
      transform: translateY(-5px);
      box-shadow: 0 12px 20px rgba(0,0,0,0.1);
    }

    /* --- KONTENER NA ZDJĘCIE --- */
    .image-wrapper {
      position: relative;
      width: 100%;
      height: 280px; /* Sztywna wysokość dla wszystkich kart */
      background-color: #f0f0f0;
      overflow: hidden;
    }

    /* --- MAGIA PROPORCJI ZDJĘĆ --- */
    ::slotted(img[slot="image"]) {
      width: 100%;
      height: 100%;
      object-fit: cover; /* To sprawia, że zdjęcia są równe i nie zniekształcone */
      object-position: center top; /* Kadrowanie od góry (ważne przy ubraniach) */
      display: block;
      transition: transform 0.5s ease;
    }
    
    /* Efekt zoom przy najechaniu */
    :host(:hover) ::slotted(img[slot="image"]) {
      transform: scale(1.05);
    }

    /* --- PROMOCJE --- */
    .promo-badge {
      position: absolute;
      top: 15px;
      right: 15px;
      z-index: 2;
    }
    ::slotted(span[slot="promo"]) {
      background-color: #e63946;
      color: white;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* --- TREŚĆ --- */
    .content {
      padding: 20px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 8px;
    }

    h2 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1d3557;
    }

    .price {
      font-size: 1.25rem;
      font-weight: 700;
      color: #457b9d;
      margin-bottom: 5px;
    }

    .meta {
      font-size: 0.85rem;
      color: #6c757d;
    }

    /* --- PRZYCISK DO KOSZYKA (DODANY) --- */
    button.add-btn {
      margin-top: auto; /* Dopycha przycisk do dołu */
      width: 100%;
      padding: 15px;
      border: none;
      background-color: #1d3557;
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    button.add-btn:hover {
      background-color: #457b9d;
    }
    
    button.add-btn:active {
      transform: scale(0.98);
    }
  </style>

  <div class="image-wrapper">
    <slot name="image"></slot>
    <div class="promo-badge">
      <slot name="promo"></slot>
    </div>
  </div>

  <div class="content">
    <h2><slot name="name">Nazwa produktu</slot></h2>
    <div class="price-display">-- PLN</div>
    
    <div class="meta">
      <slot name="colors"></slot>
    </div>
    <div class="meta">
      <slot name="sizes"></slot>
    </div>
  </div>

  <button class="add-btn">Do koszyka</button>
`;

class ProductCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
  
  static get observedAttributes() {
    return ['price'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'price' && oldValue !== newValue) {
      const priceEl = this.shadowRoot.querySelector('.price-display');
      if (priceEl) {
        priceEl.textContent = `${parseFloat(newValue).toFixed(2)} PLN`; //formatowanie
      }
    }
  }
  
  get price() { return this.getAttribute('price'); }
  set price(val) { this.setAttribute('price', val); }

_emitAddToCart() {
    const nameNode = this.shadowRoot.querySelector('slot[name="name"]');
    const nameText = nameNode && nameNode.assignedNodes().length > 0 
        ? nameNode.assignedNodes()[0].textContent 
        : 'Produkt';

    this.dispatchEvent(new CustomEvent('added-to-cart', {
        bubbles: true,
        composed: true,
        detail: { 
            name: nameText, 
            price: this.price
        }
    }));
}

connectedCallback() {
    const btn = this.shadowRoot.querySelector('.add-btn');
    btn.addEventListener('click', () => this._emitAddToCart());
}
}

customElements.define('product-card', ProductCard);