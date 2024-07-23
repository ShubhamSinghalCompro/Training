let starCoins = [];
let starCoinIds = [];
let filterStarCoins = [];
let sortOrderStar = {}; // To track sorting order for each column

// to show pagination in filters
let currentPage = 1;
const itemsPerPage = 10;

// Load favorite coins when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStarCoins();
});

// to load starred coins from local storage
async function loadStarCoins() {
    const savedStarCoinIds = localStorage.getItem('starCoinIds');
    if (savedStarCoinIds) {
        starCoinIds = JSON.parse(savedStarCoinIds);
        starCoins = allCoins.filter(coin => starCoinIds.includes(coin.id));
        const existingCoinIds = starCoins.map(coin => coin.id);
        const missingCoinIds = starCoinIds.filter(id => !existingCoinIds.includes(id));
        if (missingCoinIds.length > 0) {
            await fetchMissigIdsData(missingCoinIds, starCoins);
        }
        filterStarCoins = starCoins;
        createStarCoinTable();
        displayStarCoins(filterStarCoins);
    }
}

//toFetch missing coins data
async function fetchMissigIdsData(missingCoinIds, starCoins) {
    const COINS_API_URL = "https://api.coingecko.com/api/v3/coins/markets";
    const queryParams = new URLSearchParams({
        vs_currency: 'usd',
        ids: missingCoinIds.join(',')
    });

    try {
        const response = await fetch(`${COINS_API_URL}?${queryParams}`);
        if (!response.ok) {
            throw new Error("Failed to fetch Data");
        }

        const data = await response.json();
        if (data.length > 0) {
            starCoins.push(...data);
            return true;
        }
        return false;
    } catch (e) {
        console.error(e);
    }
}

// to save coins in local storage
function saveStarCoins() {
    localStorage.setItem('starCoinIds', JSON.stringify(starCoinIds));
}

// add to starCoins
function addToStarCoins(coinId) {
    const coin = allCoins.find(c => c.id === coinId);
    console.log(coin);
    if (coin && !starCoins.some(fav => fav.id === coinId)) {
        starCoins.push(coin);
        starCoinIds.push(coin.id);
        saveStarCoins();
        filterStarCoins = checkFilteration();
        displayStarCoins(filterStarCoins);
    }
}

// remove from starCoins
function removeFromStarCoins(coinId) {
    starCoins = starCoins.filter(coin => coin.id !== coinId);
    starCoinIds = starCoinIds.filter(id => id !== coinId);
    saveStarCoins();
    filterStarCoins = checkFilteration();
    displayStarCoins(filterStarCoins);
}

// create starred coins table
function createStarCoinTable() {
    const container = document.querySelector('#star-coins-data');
    container.innerHTML = '';

    // Create the table
    const starCoinsTable = document.createElement('table');
    starCoinsTable.classList.add('star-coins-table');
    // Append the table to the container
    container.appendChild(starCoinsTable);

    // Create the table header row
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Name</th>
        <th>Symbol</th>
        <th>Current Price</th>
        <th>Market Cap</th>
        <th>24h Change</th>
        <th>Action</th>
    `;

    // Add event listeners to headers for sorting
    headerRow.children[0].addEventListener('click', () => sortTable('name'));
    headerRow.children[1].addEventListener('click', () => sortTable('symbol'));
    headerRow.children[2].addEventListener('click', () => sortTable('current_price'));
    headerRow.children[3].addEventListener('click', () => sortTable('market_cap'));
    headerRow.children[4].addEventListener('click', () => sortTable('price_change_percentage_24h'));

    starCoinsTable.append(headerRow);

    // selecting search button
    
    
    const searchInput = document.getElementById('myInputStar');
    searchInput.classList.add("myInputStar"); 
    autocomplete(searchInput, () => starCoins, displayStarCoinsAfterFilteration);

}

// Display Star Coins After Filteration
function displayStarCoinsAfterFilteration(data) {
    currentPage = 1;
    displayStarCoins(data);
}

// display star coins
function displayStarCoins(data) {
    filterStarCoins = data;
    const starCoinsTable = document.querySelector(".star-coins-table");
    const allRows = document.querySelectorAll(".star-coin-item");
    allRows.forEach(row => {
        row.remove();
    });

    // Calculate the start and end index for the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    // Populate the table with favorite coins
    paginatedData.forEach(coin => {
        // creating coin row
        const row = createRow(coin);
        starCoinsTable.append(row);
        updateChange24h(coin.id, coin.price_change_percentage_24h, true);
    });

    // Add pagination controls
    createPaginationControls(data.length);

}

function onPressRemoveStarBtn(coinId) {
    removeFromStarCoins(coinId);

    // fetch button with class str-btn and attribute data-id = coinId
    const button = document.querySelector(`.star-btn[data-id="${coinId}"]`);
    if (button) {
        button.classList.remove('filled');
        button.classList.add('empty');
    }
}

function toggleStar(coinId, button) {
    const isStar = starCoinIds.includes(coinId);
    if (isStar) {
        removeFromStarCoins(coinId);
        button.classList.remove('filled');
        button.classList.add('empty');
    } else {
        addToStarCoins(coinId);
        button.classList.remove('empty');
        button.classList.add('filled');
    }
}

function isStarred(coinId) {
    return starCoinIds.includes(coinId);
}

function checkFilteration() {
    const searchField = document.querySelector(".myInputStar");
    let data = [];
    if (searchField && searchField.value) {
        data = starCoins.filter(coin => coin.name.substr(0, searchField.value.length).toUpperCase() == searchField.value.toUpperCase());
    } else {
        data = starCoins;
    }
    return data;
}

function createRow(coin) {
    const row = document.createElement('tr');
    row.classList.add('star-coin-item');
    row.id = `starcoin-${coin.id}`;

    // adding data to row
    row.innerHTML = `
        <td>
            <img src="${coin.image}" alt="${coin.name}" class="coin-image" />
            ${coin.name}
        </td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price}</td>
        <td>$${coin.market_cap}</td>
        <td class="change-24h">${coin.price_change_percentage_24h}%</td>
        <td><button class="remove-btn star-btn  filled" data-id="${coin.id}"><i class="fas fa-star"></i></button></td>
    `;

    // Event listener for removing from favorites
    const removeButton = row.querySelector('.remove-btn');
    removeButton.addEventListener('click', () => onPressRemoveStarBtn(coin.id));
    return row;
}
function createPaginationControls(totalItems) {
    const container = document.querySelector('#pagination-controls');
    container.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Create Previous button with icon
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '<i class="fas fa-angle-left"></i>';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayStarCoins(filterStarCoins);
        }
    });
    container.appendChild(prevButton);

    const pageText = document.createElement('span');
    pageText.textContent = `Page ${currentPage} of ${totalPages}`;
    container.appendChild(pageText);

    // Create Next button with icon
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '<i class="fas fa-angle-right"></i>';
    nextButton.disabled = currentPage === totalPages || totalPages === 1;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayStarCoins(filterStarCoins);
        }
    });
    container.appendChild(nextButton);
}

// Function to sort table based on column
function sortTable(column) {
    const isAsc = sortOrderStar[column] === 'asc';
    sortOrderStar[column] = isAsc ? 'desc' : 'asc';

    filterStarCoins.sort((a, b) => {
        if (a[column] < b[column]) {
            return isAsc ? -1 : 1;
        }
        if (a[column] > b[column]) {
            return isAsc ? 1 : -1;
        }
        return 0;
    });

    displayStarCoins(filterStarCoins);
}
