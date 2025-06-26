import { getUser } from './common.js';
import { showAlert } from './utils.js';

document.querySelector('#frmLogin').addEventListener('submit', (e) => {
    e.preventDefault();

    const email = e.target.txtEmail.value;

    getUser(email)
    .then(data => {
        if (data.length === 0) {
            showAlert('Incorrect credentials');
        } else {
            const pwd = e.target.txtPassword.value;
            if (data[0].pwd !== pwd) {
                showAlert('Incorrect credentials');
            } else {
                localStorage.setItem('userEmail', email);
                window.location.href = 'index.html';
            }
        }
    });
});