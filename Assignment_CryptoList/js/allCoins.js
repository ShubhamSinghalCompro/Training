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
    headerRow.children[1].addEventListener('click', () => sortAllCoinsTable('name'));
    headerRow.children[2].addEventListener('click', () => sortAllCoinsTable('symbol'));
    headerRow.children[3].addEventListener('click', () => sortAllCoinsTable('current_price'));
    headerRow.children[4].addEventListener('click', () => sortAllCoinsTable('market_cap'));
    headerRow.children[5].addEventListener('click', () => sortAllCoinsTable('price_change_percentage_24h'));

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

        updateChange24h(row.children[5], coin.price_change_percentage_24h);
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



let coinChart = null; // Store chart instance globally

function openModal(coin) {
    const modal = document.getElementById('coinModal');
    const modalImage = document.querySelector('.modal-coin-image');
    const modalName = document.getElementById('modalCoinName');
    const modalDetails = document.getElementById('modalCoinDetails');
    const closeBtn = document.getElementById('modalClose');
    const chartBtns = document.querySelectorAll(".updateChart");

    chartBtns.forEach(btn => {
        btn.addEventListener('click', () => updateChart(btn, coin.id));
    });

    modalImage.src = coin.image;

    modalName.innerHTML = `
    ${coin.name} (<span class="superscript">${coin.symbol.toUpperCase()}<i class="fas fa-info-circle info-icon"> <span class="tooltip-text">How is the price of ${coin.name} (${coin.symbol.toUpperCase()}) calculated? The price of ${coin.name} (${coin.symbol.toUpperCase()}) is calculated in real-time by aggregating the latest data across 29 exchanges and 31 markets, using a global volume-weighted average formula. Learn more about how crypto prices are calculated on CoinGecko.</span></i></span>)
    `;

    modalDetails.innerHTML = `
        <div class="price">
            <div><strong>$${coin.current_price}</strong></div>
            <div class="market-cap" id="details-page-market-cap-${coin.id}"><strong>$${coin.market_cap}</strong></div>
        </div>
        <div><strong>All-Time High:</strong> $${coin.ath}</div>
        <div><strong>All-Time Low:</strong> $${coin.atl}</div>
        <div><strong>Circulating Supply:</strong> ${coin.circulating_supply}</div>
        <div><strong>Max Supply:</strong> ${coin.max_supply ?? 0}</div>
        <div><strong>Total Supply:</strong> ${coin.total_supply}</div>
        <div><strong>Last Updated:</strong> ${new Date(coin.last_updated).toLocaleString()}</div>
    `;

    const detailsPageMarketCap = document.getElementById(`details-page-market-cap-${coin.id}`);
    if (detailsPageMarketCap) {
        updateChange24h(detailsPageMarketCap, coin.price_change_percentage_24h);
    }

    modal.style.display = "block";
    closeBtn.focus();

    closeBtn.onclick = function () {
        modal.style.display = "none";
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Initialize chart with default view (24h)
    updateChart(chartBtns[0], coin.id);

    // Handle keyboard accessibility
    closeBtn.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            modal.style.display = "none";
        }
    });

    // Trap focus inside the modal
    modal.addEventListener('keydown', function(event) {
        const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.key === 'Tab') {
            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    event.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    event.preventDefault();
                }
            }
        }

        if (event.key === 'Escape') {
            modal.style.display = "none";
        }
    });
}


function updateChart(btn, coinId) {
    const loader = document.getElementById('loader');
    const days = btn.id;
    const prevSelectedBtn = document.querySelector(".isSelected");
    if(prevSelectedBtn){
        prevSelectedBtn.classList.remove("isSelected");
    }
     
    btn.classList.add("isSelected");

    // Show the loader
    loader.style.display = 'block';

    fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`)
        .then(response => response.json())
        .then(data => {
            const labels = data.prices.map(price => {
                const date = new Date(price[0]);
                return (days == 1 || days == 7) ? date.toLocaleTimeString() : date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
            });
            
            const prices = data.prices.map(price => price[1]);

            const initialPrice = prices[0];
            const finalPrice = prices[prices.length - 1];
            let borderColor = 'rgba(255, 205, 86, 1)'; // yellow
            let backgroundColor = 'rgba(255, 205, 86, 0.2)'; // yellow

            if (finalPrice > initialPrice) {
                borderColor = 'rgba(45, 125, 31, 1)'; // green
                backgroundColor = 'rgba(45, 125, 31, 0.2)'; // green
            } else if (finalPrice < initialPrice) {
                borderColor = 'rgba(255, 99, 132, 1)'; // red
                backgroundColor = 'rgba(255, 99, 132, 0.2)'; // red
            } else {
                borderColor = 'rgba(53, 162, 235, 1)'; // blue
                backgroundColor = 'rgba(53, 162, 235, 0.2)'; // blue
            }

            // Destroy the previous chart instance if it exists
            if (coinChart) {
                coinChart.destroy();
            }

            // Create the chart
            const ctx = document.getElementById('coinChart').getContext('2d');
            coinChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Price (USD)',
                        data: prices,
                        borderColor: borderColor,
                        backgroundColor: backgroundColor,
                        borderWidth: 1,
                        fill: true,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            display: true,
                            title: {
                                display: true,
                                text: 'Price (USD)'
                            }
                        }
                    }
                }
            });

            // Hide the loader once the chart is loaded
            loader.style.display = 'none';
        });
}
