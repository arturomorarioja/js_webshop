import { updateCart, handleNumberInputBlur } from './products.js';
import { showAlert } from './utils.js';

/**
 * Shopping cart management
 */
const cartItemBaseTemplate = () => {
    const template = document.createElement('tr');

    const titleCell = document.createElement('td');
    titleCell.classList.add('titleCell');
    template.appendChild(titleCell);

    const amountCell = document.createElement('td');
    amountCell.classList.add('amountCell');
    amountCell.classList.add('alignRight');
    template.appendChild(amountCell);

    const removeCell = document.createElement('td');
    const removeButton = document.createElement('button');
    removeButton.classList.add('remove');
    const removeImage = document.createElement('img');
    removeImage.setAttribute('src', 'img/trash.png');
    removeImage.setAttribute('alt', 'Remove product');
    removeButton.appendChild(removeImage);
    removeCell.appendChild(removeButton);
    template.appendChild(removeCell);

    const priceCell = document.createElement('td');
    priceCell.classList.add('priceCell');
    priceCell.classList.add('alignRight');
    template.appendChild(priceCell);

    // == INITIAL IMPLEMENTATION ==
    // template.innerHTML = `
    //     <td class="titleCell"></td>
    //     <td class="amountCell alignRight"></td>
    //     <td class="removeCell"><button class="remove"><img src="img/trash.png" alt="Remove product"></button></td>
    //     <td class="priceCell alignRight"></td>
    // `;
    return template;
}
const cartItemTemplate = cartItemBaseTemplate();

document.querySelector('#optCart > a').addEventListener('click', () => {
    const cart = document.querySelector('#cart');
    const section = cart.querySelector('section');
    section.innerHTML = '';

    const cartInfo = document.createElement('div');
    const userEmail = localStorage.getItem('userEmail');
    const storedCart = JSON.parse(localStorage.getItem('ek-webshop-cart-' + userEmail));
    if (storedCart === null || storedCart.length === 0) {
        showAlert('The cart is empty. Please add some products to the cart.');
        return;
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
        const totalRow = document.createElement('tr');
        totalRow.appendChild(document.createElement('td'));
        totalRow.appendChild(document.createElement('td'));
        totalRow.appendChild(document.createElement('td'));
        
        const totalPriceCell = document.createElement('td');
        totalPriceCell.classList.add('priceCell');
        totalPriceCell.classList.add('alignRight');
        totalPriceCell.innerText = totalPrice.toFixed(2);
        totalRow.appendChild(totalPriceCell);

        productsTotal.appendChild(totalRow);

        // == INITIAL IMPLEMENTATION ==
        // productsTotal.innerHTML = `
        //     <tr>
        //         <td></td>
        //         <td></td>
        //         <td></td>
        //         <td class="priceCell alignRight">${totalPrice.toFixed(2)}</td>
        //     </tr>
        // `;
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

    // If the last product was removed, the dialog is closed and the user is informed
    if (parseFloat(totalPriceCell.innerText) === 0) {
        document.querySelector('#cart').close();
        showAlert('The cart is now empty');        
    }

    // The cart is updated in localStorage
    updateCart(this.parentElement.parentElement.firstElementChild.innerText, 0, 0);
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

    // The cart is updated in localStorage
    updateCart(this.parentElement.previousElementSibling.innerText, amount, unitPrice);
};

// Cart closing
document.querySelector('#cart > header button').addEventListener('click', function () {
    this.closest('dialog').close();
});

// Check out
document.querySelector('#cart > form').addEventListener('submit', (e) => {
    e.preventDefault();
    document.querySelector('#checkout').showModal();
});