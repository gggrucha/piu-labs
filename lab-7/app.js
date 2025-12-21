import './components/shopping-cart.js';
import './components/product-list.js'; 
import productsData from './produkty.json' with { type: 'json' };

const listComponent = document.querySelector('product-list');
const cartComponent = document.querySelector('shopping-cart');

if (listComponent) {
    listComponent.products = productsData.products;
}


document.addEventListener('added-to-cart', (e) => { /* Lista -> Koszyk */
    const productToAdd = e.detail;
    
    if (cartComponent) {
        cartComponent.addItem(productToAdd);
    }
});