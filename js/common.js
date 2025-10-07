import { baseUrl } from './info.js';

export const getUser = (email) => {
    return fetch(baseUrl + '/users?email=' + email)
    .then(response => response.json())
    .catch(error => console.log(error));
};