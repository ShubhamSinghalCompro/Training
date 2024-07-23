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

    // below code is for opening a separate dialog box while searching and implementing accessibility in it

    // inp.addEventListener("keydown", function(e) {
    //     var x = document.getElementById(this.id + "autocomplete-list");
    //     if (x) x = x.getElementsByTagName("div");
    //     if (e.keyCode == 40) {
    //         currentFocus++;
    //         addActive(x);
    //     } else if (e.keyCode == 38) {
    //         currentFocus--;
    //         addActive(x);
    //     } else if (e.keyCode == 13) {
    //         e.preventDefault();
    //         if (currentFocus > -1) {
    //             if (x) x[currentFocus].click();
    //         }
    //     }
    // });

    // function addActive(x) {
    //     if (!x) return false;
    //     removeActive(x);
    //     if (currentFocus >= x.length) currentFocus = 0;
    //     if (currentFocus < 0) currentFocus = (x.length - 1);
    //     x[currentFocus].classList.add("autocomplete-active");
    // }

    // function removeActive(x) {
    //     for (var i = 0; i < x.length; i++) {
    //         x[i].classList.remove("autocomplete-active");
    //     }
    // }

    // function closeAllLists(elmnt) {
    //     var x = document.getElementsByClassName("autocomplete-items");
    //     for (var i = 0; i < x.length; i++) {
    //         if (elmnt != x[i] && elmnt != inp) {
    //             x[i].parentNode.removeChild(x[i]);
    //         }
    //     }
    // }

    // document.addEventListener("click", function (e) {
    //     closeAllLists(e.target);
    // });
}

async function fetchFilteredCoins(name){
    const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${name}`);
    const data = await response.json();
    console.log(data);
    return data.coins;
}