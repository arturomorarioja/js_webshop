import { baseUrl } from './info.js';

export const getUser = (email) => {
    return fetch(baseUrl + '/users?q=' + email)
    .then(response => response.json())
    .catch(error => console.log(error));
};