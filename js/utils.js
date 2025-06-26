export const showAlert = (message) => {
    const alert = document.querySelector('#alert');
    const paragraph = alert.querySelector('section > p');
    paragraph.innerText = message;
    
    // Alert dialog closing button
    alert.querySelector('header button').addEventListener('click', () => {
        alert.close();
    });

    alert.showModal();
    alert.focus();  // This prevents the focus from being on the close button
};