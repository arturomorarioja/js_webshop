import { baseUrl } from './info.js';
import { getUser } from './common.js';
import { showAlert } from './utils.js';

document.querySelector('#frmSignup').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = e.target.txtEmail.value.trim();
    const pwd = e.target.txtPassword.value.trim();
    const repeatPwd = e.target.txtRepeatPassword.value.trim();

    const emailExists = (email) => {
        return getUser(email)
        .then(data => data.length > 0);
    };

    const insertUser = (email, pwd) => {

        // Calculate the new ID based on the highest existing one
        
        return fetch(baseUrl + '/users')
        .then(response => response.json())
        .then((data) => {
            let newID;
            if (data.length === 0) {
                newID = 1;
            } else {
                newID = parseInt(data[data.length - 1].id) + 1;
            }

            const params = new URLSearchParams();
            params.append('id', String(newID));
            params.append('email', email);
            params.append('pwd', pwd);

            // Insert the new user

            return fetch(baseUrl + '/users', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params
            }).then(response => response.json())
            .catch((error) => { 
                console.log(error); 
                return false;
            });
        });
    };

    if (pwd !== repeatPwd) {
        showAlert('The passwords do not match');        
    } else {
        const exists = await emailExists(email);
        if (exists) {
            showAlert('The email already exists');                
        } else {
            const ret = await insertUser(email, pwd);
            if (ret) {
                showAlert('The user was created successfully');
                e.target.reset();
            } else {
                showAlert('There was a problem while trying to create the user');
            }
        }            
    }
});