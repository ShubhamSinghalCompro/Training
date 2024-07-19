let starCoins = [];
let starCoinIds = [];
let filterStarCoins = [];
// let sortOrder = {}; // To track sorting order for each column

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
        <th>
            Name
            <button id="searchStarCoins">🔍</button>
            <button class="sort-btn" data-column="name" data-order="asc">⬆️</button>
            <button class="sort-btn" data-column="name" data-order="desc">⬇️</button>
        </th>
        <th>
            Symbol
            <button class="sort-btn" data-column="symbol" data-order="asc">⬆️</button>
            <button class="sort-btn" data-column="symbol" data-order="desc">⬇️</button>
        </th>
        <th>
            Current Price
            <button class="sort-btn" data-column="current_price" data-order="asc">⬆️</button>
            <button class="sort-btn" data-column="current_price" data-order="desc">⬇️</button>
        </th>
        <th>
            Market Cap
            <button class="sort-btn" data-column="market_cap" data-order="asc">⬆️</button>
            <button class="sort-btn" data-column="market_cap" data-order="desc">⬇️</button>
        </th>
        <th>
            24h Change
            <button class="sort-btn" data-column="price_change_percentage_24h" data-order="asc">⬆️</button>
            <button class="sort-btn" data-column="price_change_percentage_24h" data-order="desc">⬇️</button>
        </th>
        <th>Action</th>
    `;

    starCoinsTable.append(headerRow);

    // Add event listeners for sorting buttons
    const sortButtons = headerRow.querySelectorAll('.sort-btn');
    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            const column = button.dataset.column;
            const order = button.dataset.order;
            sortStarCoinsTable(column, order);
        });
    });

    // Selecting search button
    const searchStarCoinsBtn = document.getElementById("searchStarCoins");
    searchStarCoinsBtn.addEventListener('click', () => {
        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Search by name...');
        searchInput.setAttribute('id', 'myInputStar');
        searchInput.classList.add("myInputStar");
        headerRow.children[0].append(searchInput);
        autocomplete(searchInput, starCoins, displayStarCoinsAfterFilteration);
    });
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
    });

    // Add pagination controls
    createPaginationControls(data.length);

}

function onPressRemoveStarBtn(coinId) {
    removeFromStarCoins(coinId);

    // fetch button with class str-btn and attribute data-id = coinId
    const button = document.querySelector(`.star-btn[data-id="${coinId}"]`);
    if (button) {
        button.textContent = 'Add to Favorites';
    }
}

function toggleStar(coinId, button) {
    const isStar = starCoinIds.some(starId => starId === coinId);
    if (isStar) {
        removeFromStarCoins(coinId);
        button.textContent = 'Add to Favorites';
    } else {
        addToStarCoins(coinId);
        button.textContent = 'Remove from Favorites';
    }
}

function isStarred(coinId) {
    const isStar = starCoinIds.some(starId => starId === coinId);
    if (isStar) {
        return true;
    } else {
        return false;
    }
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

    // adding data to row
    row.innerHTML = `
        <td>${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>$${coin.current_price}</td>
        <td>$${coin.market_cap}</td>
        <td>${coin.price_change_percentage_24h}%</td>
        <td><button class="remove-star-btn" data-id="${coin.id}">Remove</button></td>
    `;

    // Event listener for removing from favorites
    const removeButton = row.querySelector('.remove-star-btn');
    removeButton.addEventListener('click', () => onPressRemoveStarBtn(coin.id));
    return row;
}

function createPaginationControls(totalItems) {
    const container = document.querySelector('#pagination-controls');
    container.innerHTML = '';

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Create Previous button
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayStarCoins(filterStarCoins);
        }
    });
    container.appendChild(prevButton);

    // Create Next button
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayStarCoins(filterStarCoins);
        }
    });
    container.appendChild(nextButton);
}

// Function to sort table based on column
function sortStarCoinsTable(column, order) {
    const isAsc = order === 'asc';

    filterStarCoins.sort((a, b) => {
        if (a[column] < b[column]) {
            return isAsc ? -1 : 1;
        }
        if (a[column] > b[column]) {
            return isAsc ? 1 : -1;
        }
        return 0;
    });

    currentPage = 1;
    displayStarCoins(filterStarCoins);
}