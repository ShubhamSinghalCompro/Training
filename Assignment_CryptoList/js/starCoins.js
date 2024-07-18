let starCoins = [];

// Load favorite coins when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadStarCoins();
});

// to load starred coins from local storage
function loadStarCoins() {
    const savedStarCoins = localStorage.getItem('starCoins');
    if (savedStarCoins) {
        starCoins = JSON.parse(savedStarCoins);
        displayStarCoins();
    }
}

// to save coins in local
function saveStarCoins(){
    localStorage.setItem('starCoins', JSON.stringify(starCoins));
}

// add to starCoins
function addToStarCoins(coinId) {
    const coin = allCoins.find(c => c.id === coinId);
    if (coin && !starCoins.some(fav => fav.id === coinId)) {
        starCoins.push(coin);
        saveStarCoins();
        displayStarCoins();
    }
}

// remove from starCoins
function removeFromStarCoins(coinId) {
    starCoins = starCoins.filter(coin => coin.id !== coinId);
    saveStarCoins();
    displayStarCoins();
}

// display star coins
function displayStarCoins() {
    const container = document.querySelector('#star-coins-data');
    console.log(container);
    container.innerHTML = '';

    // Create the table
    const starCoinsTable = document.createElement('table');
    starCoinsTable.classList.add('star-coins-table');

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
    starCoinsTable.append(headerRow);

    // Populate the table with favorite coins
    starCoins.forEach(coin => {
        //creating coin row
        const row = document.createElement('tr');
        row.classList.add('coin-item');

        //adding data to row
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
        starCoinsTable.append(row);
    });

    // Append the table to the container
    container.appendChild(starCoinsTable);
}


function onPressRemoveStarBtn(coinId){
    removeFromStarCoins(coinId);

    //fetch button with class str-btn and attribut data-id = coinId
    const button = document.querySelector(`.star-btn[data-id="${coinId}"]`);
    button.textContent = 'Add to Favorites';
}

function toggleStar(coinId, button) {
    const isStar = starCoins.some(star => star.id === coinId);
    if (isStar) {
        removeFromStarCoins(coinId);
        button.textContent = 'Add to Favorites';
    } else {
        addToStarCoins(coinId);
        button.textContent = 'Remove from Favorites';
    }
}

function isStarred(coinId) {
    const isStar = starCoins.some(star => star.id === coinId);
    if (isStar) {
        return true;
    } else {
        return false;
    }
}