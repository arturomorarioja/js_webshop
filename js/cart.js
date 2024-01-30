import { handleNumberInputBlur } from './products.js';

/**
 * Shopping cart management
 */
const cartItemBaseTemplate = () => {
    const template = document.createElement('tr');
    template.innerHTML = `
        <td class="titleCell"></td>
        <td class="amountCell alignRight"></td>
        <td class="removeCell"><button class="remove"><img src="img/trash.png" alt="Remove product"></button></td>
        <td class="priceCell alignRight"></td>
    `;
    return template;
}
const cartItemTemplate = cartItemBaseTemplate();

const cart = document.querySelector('#cart');
document.querySelector('#optCart > a').addEventListener('click', () => {
    const section = cart.querySelector('section');
    section.innerHTML = '';

    const cartInfo = document.createElement('div');
    const storedCart = JSON.parse(localStorage.getItem('kea-webshop-cart'));
    if (storedCart === null || storedCart.length === 0) {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.innerText = 'The cart is empty. Please add some products to the cart.';
        cartInfo.appendChild(emptyCartMessage);
    } else {
        let totalPrice = 0;
        const products = document.createElement('table');        
        storedCart.forEach((item) => {
            const itemPrice = item.amount * item['unit-price'];
            totalPrice += itemPrice;

            const row = cartItemTemplate.cloneNode(true);
            
            row.querySelector('.titleCell').innerText = item.product;
            
            const amountTextbox = document.createElement('input');
            amountTextbox.setAttribute('type', 'number');
            amountTextbox.setAttribute('min', '1');
            amountTextbox.setAttribute('max', '100');
            amountTextbox.setAttribute('value', item.amount);
            amountTextbox.addEventListener('blur', handleNumberInputBlur);
            amountTextbox.addEventListener('change', handleNumberInputChange);
            row.querySelector('.amountCell').appendChild(amountTextbox);
            
            // The original price is stored to recalculate the price when the amount changes
            const priceCell = row.querySelector('.priceCell');
            priceCell.innerText = `${itemPrice.toFixed(2)}`;
            priceCell.setAttribute('default-value', item['unit-price']);

            row.querySelector('.remove').addEventListener('click', handleRemoveProduct);

            products.appendChild(row);
        });
        const productsTotal = document.createElement('tfoot');
        productsTotal.innerHTML = `
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="priceCell alignRight">${totalPrice.toFixed(2)}</td>
            </tr>
        `;
        products.appendChild(productsTotal);
        cartInfo.appendChild(products);

    }
    section.appendChild(cartInfo);
    cart.showModal();
});

/**
 * When a product is removed from the cart, the amount has to be deducted from the total
 */
const handleRemoveProduct = function() {
    const itemPrice = parseFloat(this.parentElement.nextElementSibling.innerText);
    const totalPriceCell = document.querySelector('tfoot .priceCell');

    totalPriceCell.innerText = (parseFloat(totalPriceCell.innerText) - itemPrice).toFixed(2);

    this.parentElement.parentElement.remove();
}

/**
 * When the amount of any product changes, 
 * both the price of said product and the total must update accordingly
 */
const handleNumberInputChange = function() {
    const itemPriceCell = this.parentElement.parentElement.lastElementChild;
    const previousItemPrice = parseFloat(itemPriceCell.innerText);

    const amount = parseInt(this.value);
    const unitPrice = parseFloat(itemPriceCell.getAttribute('default-value'));
    const newItemPrice = parseFloat(amount * unitPrice);
    itemPriceCell.innerText = newItemPrice.toFixed(2);

    const total = document.querySelector('tfoot td.priceCell');
    total.innerHTML = (parseFloat(total.innerText) + newItemPrice - previousItemPrice).toFixed(2);
};

// Cart closing
document.querySelector('#cart > header > div').addEventListener('click', () => {
    cart.close();
});