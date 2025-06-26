import { showAlert } from './utils.js';

// Use the delivery address as billing address
document.querySelector('#chkRepeat').addEventListener('change', function() {
    const billingAddress = document.querySelector('#txtBillingAddress');
    const billingPostalCode = document.querySelector('#txtBillingPostalCode');
    const billingCity = document.querySelector('#txtBillingCity');

    // Toggling the required attribute is necessary to submit the form without console errors
    if (this.checked) {
        document.querySelector('#billingInfo').classList.add('hidden');
    
        billingAddress.removeAttribute('required');
        billingPostalCode.removeAttribute('required');
        billingCity.removeAttribute('required');
    } else {
        document.querySelector('#billingInfo').classList.remove('hidden');
        
        billingAddress.value = document.querySelector('#txtDeliveryAddress').value;
        billingAddress.setAttribute('required', 'required');
        
        billingPostalCode.value = document.querySelector('#txtDeliveryPostalCode').value;
        billingPostalCode.setAttribute('required', 'required');
        
        billingCity.value = document.querySelector('#txtDeliveryCity').value;
        billingCity.setAttribute('required', 'required');
    }
});

// Check out dialog closing
document.querySelector('#checkout > header button').addEventListener('click', function () {
    this.closest('dialog').close();
});

/**
 * Submit. The cart is emptied and a message is shown
 */
document.querySelector('#checkout form').addEventListener('submit', function(e) {
    const userEmail = localStorage.getItem('userEmail');
    localStorage.removeItem('ek-webshop-cart-' + userEmail);
    showAlert('Your order has been processed.');
    
    this.parentElement.close();
    document.querySelector('#cart').close();

    e.target.querySelectorAll('input').forEach(element => {
        element.value = '';
    });
});