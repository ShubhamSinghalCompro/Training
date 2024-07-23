let allCoins = [];
let filteredCoins = [];
let lastCoinIndex = -1;
let sortOrderAllCoins = {}; 

//fetch all coins data
async function fetchAllCoins(currPage){

    // API URL to fetch Coins Data
    const COINS_API_URL = "https://api.coingecko.com/api/v3/coins/markets"; 
    
    // Query Params to configure data as per requirement
    const queryParams = new URLSearchParams({
        vs_currency: "usd",
        order: "market_cap_desc",
        page: currPage,
        sparkline: false
    });

    try {
        const response = await fetch(`${COINS_API_URL}?${queryParams}`, {
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        if(!response.ok){
            throw new Error("Failed to fetch Data");
        }

        const data = await response.json();
        if(data.length > 0){
            //using spread operator to get elements of data
            allCoins.push(...data);
            currPage++;
            queryParams.set("page", currPage);
            return true;  
        }
        return false;
        
    } catch (e) {
        console.error(e);
    }
}

function createAllCoinTable(){
    const container = document.querySelector("#all-coins-data");
    container.innerHTML = '';

    //creating allCoinsTable
    const allCoinTable = document.createElement("table");
    allCoinTable.classList.add("all-coin-table");
    container.append(allCoinTable);

    //creating table header
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>Action</th>
        <th>Name</th>
        <th>Symbol</th>
        <th>Current Price</th>
        <th>Market Cap</th>
        <th>24h Change</th>
        <th>Details</th>
    `;
    allCoinTable.append(headerRow);

    // Add event listeners to headers for sorting
    headerRow.children[0].addEventListener('click', () => sortAllCoinsTable('name'));
    headerRow.children[1].addEventListener('click', () => sortAllCoinsTable('symbol'));
    headerRow.children[2].addEventListener('click', () => sortAllCoinsTable('current_price'));
    headerRow.children[3].addEventListener('click', () => sortAllCoinsTable('market_cap'));
    headerRow.children[4].addEventListener('click', () => sortAllCoinsTable('price_change_percentage_24h'));

    //creating viewMore Button
    const viewMoreButton = document.getElementById("view-more-btn");
    //adding event listner to view more button
    viewMoreButton.addEventListener('click', () => createNextCoinsList(allCoinTable, filteredCoins));

    // selecting search button
    const searchInput = document.getElementById('myInput');  
    searchInput.classList.add("myInput");
    autocomplete(searchInput, () => allCoins, displayAllCoins);

    return true;
}

// display all coins data
function displayAllCoins(data, numberRows = 9){
    lastCoinIndex = -1;
    filteredCoins = data;
    //fetching allCoin Table
    const allCoinTable = document.querySelector(".all-coin-table");

    //fetching all the rows to remove
    const allRows = document.querySelectorAll(".coin-item");
    allRows.forEach(row => {
        row.remove();
    });

    // printing first 10 elements
    createNextCoinsList(allCoinTable, data, numberRows); 

}

async function createNextCoinsList(allCoinTable, data, numberRows = 9){
    if(lastCoinIndex != data.length-1){
        const startIndex = lastCoinIndex + 1;
        const endIndex = Math.min(startIndex + numberRows, data.length -1);
        const nextCoins = data.slice(startIndex, endIndex + 1);
        lastCoinIndex = endIndex;
        displayCoins(nextCoins, allCoinTable);
    }
    else{

        //calculating current page of API
        let currPage = allCoins.length / 100;
        currPage = currPage + 1;
        const fetchNewCoins = await fetchAllCoins(currPage);
        const searchField = document.querySelector(".myInput");
        if(searchField && searchField.value){
            filteredCoins = allCoins.filter(coin => coin.name.substr(0, searchField.value.length).toUpperCase() == searchField.value.toUpperCase());
            
        }
        else{
            filteredCoins = allCoins;
        }
        data = filteredCoins;
        if(fetchNewCoins){
            createNextCoinsList(allCoinTable, data, numberRows);
        }
        else{
            console.log("no More Coins Left");
        }
    }
}

function displayCoins(data, allCoinTable) {
    data.forEach(coin => {
        const row = document.createElement('tr');
        row.classList.add('coin-item');
        row.id = `coin-${coin.id}`;

        const isStar = isStarred(coin.id);
        const buttonClass = isStar ? 'filled' : 'empty';

        row.innerHTML = `
            <td><button class="star-btn ${buttonClass}" data-id="${coin.id}"><i class="fas fa-star"></i></button></td>
            <td><img src="${coin.image}" alt="${coin.name}" class="coin-image" />
                ${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.market_cap}</td>
            <td class="change-24h">${coin.price_change_percentage_24h}</td>
            <td><button class="details-btn" data-id="${coin.id}"><i class="fa fa-eye" aria-hidden="true"></i></button></td>
        `;

        const starButton = row.querySelector('.star-btn');
        starButton.addEventListener('click', () => toggleStar(coin.id, starButton));

        const detailsButton = row.querySelector('.details-btn');
        detailsButton.addEventListener('click', () => openModal(coin));

        allCoinTable.append(row);

        updateChange24h(coin.id, coin.price_change_percentage_24h, false);
    });
}


function hideUnfilteredRows(filteredCoins){
    const allRows = document.querySelectorAll('.coin-item');
    allRows.forEach(row => {
        const coinNameElement = row.querySelector('td:first-child');
        const coinName = coinNameElement.textContent.trim();
        const isCoinInFilteredList = filteredCoins.some(filteredCoin => filteredCoin.name === coinName);
        
        if (!isCoinInFilteredList) {
            row.classList.add("hidden-row");
        } else {
            row.classList.remove("hidden-row");
        }
    });
}

// Function to sort table based on column
function sortAllCoinsTable(column) {
    const isAsc = sortOrderAllCoins[column] === 'asc';
    sortOrderAllCoins[column] = isAsc ? 'desc' : 'asc';

    filteredCoins.sort((a, b) => {
        if (a[column] < b[column]) {
            return isAsc ? -1 : 1;
        }
        if (a[column] > b[column]) {
            return isAsc ? 1 : -1;
        }
        return 0;
    });
    displayAllCoins(filteredCoins, lastCoinIndex);
}


function openModal(coin) {
    const modal = document.getElementById('coinModal');
    const modalImage = document.getElementById('modalCoinImage');
    const modalName = document.getElementById('modalCoinName');
    const modalDetails = document.getElementById('modalCoinDetails');
    const closeBtn = document.getElementById('modalClose');

    modalImage.src = coin.image;
    modalName.innerHTML = `
        ${coin.name}
        <i class="fas fa-info-circle info-icon" title="How is the price of ${coin.name} (${coin.symbol.toUpperCase()}) calculated?"></i>
        <span class="tooltip-text">The price of ${coin.name} (${coin.symbol.toUpperCase()}) is calculated in real-time by aggregating the latest data across 29 exchanges and 31 markets, using a global volume-weighted average formula. Learn more about how crypto prices are calculated on CoinGecko.</span>
    `;

    modalDetails.innerHTML = `
        <div><strong>Symbol:</strong> ${coin.symbol.toUpperCase()}</div>
        <div><strong>Current Price:</strong> $${coin.current_price}</div>
        <div><strong>Market Cap:</strong> $${coin.market_cap}</div>
        <div><strong>24h Change:</strong> ${coin.price_change_percentage_24h}%</div>
        <div><strong>All-Time High:</strong> $${coin.ath}</div>
        <div><strong>All-Time Low:</strong> $${coin.atl}</div>
        <div><strong>Circulating Supply:</strong> ${coin.circulating_supply}</div>
        <div><strong>Max Supply:</strong> ${coin.max_supply ?? 0}</div>
        <div><strong>Total Supply:</strong> ${coin.total_supply}</div>
        <div><strong>Last Updated:</strong> ${new Date(coin.last_updated).toLocaleString()}</div>
    `;

    modal.style.display = "block";

    // Close modal when clicking on <span> (x)
    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    // Close modal when clicking outside of the modal content
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}