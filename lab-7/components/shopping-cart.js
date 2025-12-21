const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      min-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      font-family: 'Segoe UI', sans-serif;
    }
    h2 { margin-top: 0; border-bottom: 2px solid #eee; padding-bottom: 10px; }
    ul { list-style: none; padding: 0; margin: 0; }
    li { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      padding: 10px 0; 
      border-bottom: 1px solid #f0f0f0; 
    }
    .remove-btn {
      background: #ff4d4d;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      cursor: pointer;
      margin-left: 10px;
      font-size: 0.8rem;
    }
    .remove-btn:hover { background: #e60000; }
    .total {
      margin-top: 20px;
      font-size: 1.2rem;
      font-weight: bold;
      text-align: right;
      color: #2c3e50;
    }
    .empty-msg { color: #888; font-style: italic; text-align: center; margin-top: 20px;}
  </style>

  <h2>Twój Koszyk</h2>
  <div id="items-container">
    <div class="empty-msg">Koszyk jest pusty</div>
  </div>
  <div class="total">Suma: 0.00 PLN</div>
`;

export class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this.items = []; // Stan koszyka, czyści się przy odswiezeniu strony
  }

  addItem(product) {
    this.items.push(product);
    this.render();
  }

  removeItem(index) {
    this.items.splice(index, 1);
    this.render();
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2);
  }

  render() {
    const container = this.shadowRoot.getElementById('items-container');
    const totalEl = this.shadowRoot.querySelector('.total');
    
    container.innerHTML = '';

    if (this.items.length === 0) {
      container.innerHTML = '<div class="empty-msg">Koszyk jest pusty</div>';
      totalEl.textContent = 'Suma: 0.00 PLN';
      return;
    }

    const list = document.createElement('ul');

    this.items.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item.name} (${parseFloat(item.price).toFixed(2)} PLN)</span>
      `;
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = 'Usuń';
      removeBtn.onclick = () => this.removeItem(index);

      li.appendChild(removeBtn);
      list.appendChild(li);
    });

    container.appendChild(list);
    totalEl.textContent = `Suma: ${this.getTotal()} PLN`;
  }
}

customElements.define('shopping-cart', ShoppingCart);