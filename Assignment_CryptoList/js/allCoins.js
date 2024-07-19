let allCoins = [];
let filteredCoins = [];
let lastCoinIndex = -1;

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
        const response = await fetch(`${COINS_API_URL}?${queryParams}`);
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

// display all coins data
function displayAllCoins(){
    filteredCoins = allCoins;
    const container = document.querySelector("#all-coins-data");
    console.log(container);
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

    //creating viewMore Button
    const viewMoreButton = document.createElement("button");
    viewMoreButton.setAttribute('id', "view-more-btn");
    viewMoreButton.textContent = "View More";
    container.append(viewMoreButton);

    //adding event listner to view more button
    viewMoreButton.addEventListener('click', () => createNextCoinsList(allCoinTable));
    createNextCoinsList(allCoinTable);

    // selecting search button
    const searchAllCoinsBtn = document.getElementById("searchAllCoins");
    searchAllCoinsBtn.addEventListener('click', () => {
        const searchInput = document.createElement('input');
        searchInput.setAttribute('type', 'text');
        searchInput.setAttribute('placeholder', 'Search by name...');
        searchInput.setAttribute('id', 'myInput');
        searchInput.classList.add("myInput");
        headerRow.children[0].append(searchInput);
        autocomplete(searchInput, allCoins);
    });
}

async function createNextCoinsList(allCoinTable){
    if(lastCoinIndex != allCoins.length-1){
        const startIndex = lastCoinIndex + 1;
        const endIndex = Math.min(startIndex + 9, allCoins.length -1);
        const nextCoins = allCoins.slice(startIndex, endIndex + 1);
        lastCoinIndex = endIndex;
        displayCoins(nextCoins, allCoinTable);
    }
    else{

        //calculating current page of API
        let currPage = allCoins.length / 100;
        currPage = currPage + 1;
        const fetchNewCoins = await fetchAllCoins(currPage);
        if(fetchNewCoins){
            createNextCoinsList(allCoinTable);
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

        //checking if coinName is in filter and showing row accordingly
        const coinName = coin.name;
        console.log(coinName);
        const isCoinInFilteredList = filteredCoins.some(filteredCoin => filteredCoin.name === coinName);
        
        if (!isCoinInFilteredList) {
            row.classList.add("hidden-row");
        }
    });
}

function hideUnfilteredRows(filteredCoins){
    const allRows = document.querySelectorAll('.coin-item');
    console.log(allRows);
    allRows.forEach(row => {
        const coinNameElement = row.querySelector('td:first-child');
        const coinName = coinNameElement.textContent.trim();
        console.log(coinName);
        const isCoinInFilteredList = filteredCoins.some(filteredCoin => filteredCoin.name === coinName);
        
        if (!isCoinInFilteredList) {
            row.classList.add("hidden-row");
        } else {
            row.classList.remove("hidden-row");
        }
    });
}