function autocompleteByAPI(inp, displayCoins) {
    var currentFocus;
    inp.addEventListener("input", async function(e) {
        let val = this.value;
        //closeAllLists();
        if (!val || val.length <3) {
            return;
        }
        currentFocus = -1;
        const coins = await fetchFilteredCoins(val);
        const filteredCoins = [];
        filteredCoins.push(...coins);
        displayCoins(filteredCoins);
    });
}

async function fetchFilteredCoins(name){
    try{
        const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${name}`);
        const data = await response.json();
        return data.coins;
    }
    catch(e){
        console.log(e);
    }
}