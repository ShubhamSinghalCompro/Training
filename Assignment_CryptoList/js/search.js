function autocomplete(inp, getArray, displayCoins) {
    var currentFocus;
    inp.addEventListener("input", function(e) {
        let val = this.value;
        const arr = getArray(); 
        if (!val) {
            const filteredCoins = arr;
            displayCoins(filteredCoins); 
            return;
        }
        currentFocus = -1;
        const filteredCoins = arr.filter(coin => coin.name.substr(0, val.length).toUpperCase() == val.toUpperCase());
        displayCoins(filteredCoins);
    });
}