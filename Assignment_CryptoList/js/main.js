document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display all coins
    const coinsFetch = await fetchAllCoins(1);
    if(coinsFetch){
        displayAllCoins(allCoins);
    }
    else{
        console.log("Error while fetching coins");
    }
    // Load and display star coins
    loadStarCoins();
});

