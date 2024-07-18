let allCoins = [];

//fetch all coins data
async function fetchAllCoins(){
    //current page number
    let currPage = 1;

    // API URL to fetch Coins Data
    const COINS_API_URL = "https://api.coingecko.com/api/v3/coins/markets"; 
    
    // Query Params to configure data as per requirement
    const queryParams = new URLSearchParams({
        vs_currency: "usd",
        order: 'market_cap_desc',
        page: currPage,
        sparkline: false
    });

    try {
        //  while(true){
            const response = await fetch(`${COINS_API_URL}?${queryParams}`);
            if(!response.ok){
                throw new Error("Failed to fetch Data");
            }

            const data = await response.json();
            if(data.length > 0){
                //using spread operator to get elements of data
                allCoins.push(...data);
                currPage++;
                queryParams.set('page', currPage);
                displayAllCoins(allCoins);
            }
        //     else{
        //         displayAllCoins(allCoins);
        //         break;
        //     }
        // }
    } catch (e) {
        console.error(e);
    }
}

// display all coins data
function displayAllCoins(data){
    const container = document.querySelector('#all-coins-data');
    console.log(container);
    container.innerHTML = '';

    // const table = document.querySelector('.all-coin-table');
    // console.log(table);

    //creating allCoinsTable
    const allCoinTable = document.createElement('table');
    allCoinTable.classList.add('all-coin-table');


    //creating table header
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Name</th>
        <th>Symbol</th>
        <th>Current Price</th>
        <th>Market Cap</th>
        <th>24h Change</th>
        <th>Action</th>
    `;
    allCoinTable.append(headerRow);

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
    container.append(allCoinTable);
}