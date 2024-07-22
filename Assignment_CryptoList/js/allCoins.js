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
        <th>Name<button id="searchAllCoins">🔍</button></th>
        <th>Symbol</th>
        <th>Current Price</th>
        <th>Market Cap</th>
        <th>24h Change</th>
        <th>Action</th>
    `;
    allCoinTable.append(headerRow);

    // Add event listeners to headers for sorting
    headerRow.children[0].addEventListener('click', () => sortAllCoinsTable('name'));
    headerRow.children[1].addEventListener('click', () => sortAllCoinsTable('symbol'));
    headerRow.children[2].addEventListener('click', () => sortAllCoinsTable('current_price'));
    headerRow.children[3].addEventListener('click', () => sortAllCoinsTable('market_cap'));
    headerRow.children[4].addEventListener('click', () => sortAllCoinsTable('price_change_percentage_24h'));

    //creating viewMore Button
    const viewMoreButton = document.createElement("button");
    viewMoreButton.setAttribute('id', "view-more-btn");
    viewMoreButton.textContent = "View More";
    container.append(viewMoreButton);

    //adding event listner to view more button
    viewMoreButton.addEventListener('click', () => createNextCoinsList(allCoinTable, filteredCoins));

    // selecting search button
    const searchAllCoinsBtn = document.getElementById("searchAllCoins");
    searchAllCoinsBtn.addEventListener('click', () => {
        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Search by name...');
        searchInput.setAttribute('id', 'myInput');
        searchInput.classList.add("myInput");
        headerRow.children[0].append(searchInput);
        autocomplete(searchInput, allCoins, displayAllCoins);
    });

    return true;
}

// display all coins data
function displayAllCoins(data){
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
    createNextCoinsList(allCoinTable, data); 

}

async function createNextCoinsList(allCoinTable, data){
    if(lastCoinIndex != data.length-1){
        const startIndex = lastCoinIndex + 1;
        const endIndex = Math.min(startIndex + 9, data.length -1);
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
            createNextCoinsList(allCoinTable, data);
        }
        else{
            console.log("no More Coins Left");
        }
    }
}

function displayCoins(data, allCoinTable){
    data.forEach(coin => {
        //creating coin row
        const row = document.createElement('tr');
        row.classList.add('coin-item');

        //check if button exists in starred
        const isStar = isStarred(coin.id);
        const buttonText = isStar ? 'Remove from Favorites' : 'Add to Favorites';

        //adding data to row
        row.innerHTML = `
            <td>${coin.name}</td>
            <td>${coin.symbol.toUpperCase()}</td>
            <td>$${coin.current_price}</td>
            <td>$${coin.market_cap}</td>
            <td>${coin.price_change_percentage_24h}%</td>
            <td><button class="star-btn" data-id="${coin.id}">${buttonText}</button></td>
        `;

        // Event listener for the favorite button
        const starButton = row.querySelector('.star-btn');
        starButton.addEventListener('click', () => toggleStar(coin.id, starButton));

        //appending row
        allCoinTable.append(row);
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
    displayAllCoins(filteredCoins);
}