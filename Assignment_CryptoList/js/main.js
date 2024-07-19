document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display all coins
    const coinsFetch = await fetchAllCoins(1);
    
    if(coinsFetch){
        filteredCoins = allCoins;
        const isTableCreated = await createAllCoinTable(filteredCoins);
        if(isTableCreated){
            displayAllCoins(filteredCoins);
        } 
    }
    else{
        console.log("Error while fetching coins");
    }
    // Load and display star coins
    loadStarCoins();
});



