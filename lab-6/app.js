import { Ajax } from './ajax.js';

const client = new Ajax({
    timeout: 5000
});

const btnLoad = document.getElementById('btn-load');
const btnError = document.getElementById('btn-error'); //404
const btnServerError = document.getElementById('btn-server-error'); //500
const btnReset = document.getElementById('btn-reset');
const loader = document.getElementById('loader');
const errorMsg = document.getElementById('error-msg');
const resultsList = document.getElementById('results-list');

const showLoader = (show) => {
    if(show) {
        loader.classList.add('active');
        btnLoad.disabled = true;
        btnError.disabled = true;
    } else {
        loader.classList.remove('active');
        btnLoad.disabled = false;
        btnError.disabled = false;
    }
};

const displayError = (err) => {
    errorMsg.style.display = 'block';

    if (err.status) {
        errorMsg.innerHTML = `<strong>Błąd HTTP ${err.status}:</strong> ${err.statusText || 'Wystąpił problem z serwerem'}`;
    } else {
        errorMsg.innerHTML = `<strong>Błąd:</strong> ${err.message}`;
    }
};

const displayData = (data) => {
    const items = Array.isArray(data) ? data.slice(0, 20) : [data];

    items.forEach(post => {
        const li = document.createElement('li');
        li.className = 'post-item';
        li.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.body}</p>
        `;
        resultsList.appendChild(li);
    });
};

const clearView = () => {
    resultsList.innerHTML = '';
    errorMsg.style.display = 'none';
};

// --- SCENARIUSZ SUKCESU ---
btnLoad.addEventListener('click', async () => {
    clearView();
    showLoader(true);

    try {
        const data = await client.get('https://jsonplaceholder.typicode.com/posts');
        displayData(data);
    } catch (err) {
        displayError(err);
    } finally {
        showLoader(false);
    }
});

// --- SCENARIUSZ BŁĘDU (404) ---
btnError.addEventListener('click', async () => {
    clearView();
    showLoader(true);

    try {
        await client.get('https://jsonplaceholder.typicode.com/posts/nieistniejace-id');
    } catch (err) {
        displayError(err);
    } finally {
        showLoader(false);
    }
});

// --- SCENARIUSZ BŁĘDU (504) ---
btnServerError.addEventListener('click', async () => {
    clearView();
    showLoader(true);

    try {
        await client.get('https://httpbin.org/status/500');    
    } catch (err) {
        displayError(err);
    } finally {
        showLoader(false);
    }
});

// --- RESET ---
btnReset.addEventListener('click', () => {
    clearView();
});