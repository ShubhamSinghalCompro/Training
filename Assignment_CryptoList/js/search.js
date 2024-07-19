function autocomplete(inp, arr) {
    var currentFocus;
    console.log(this.value);
    inp.addEventListener("input", function(e) {
        let val = this.value;
        console.log(this);
        console.log(val);
        closeAllLists();
        if (!val) {
            filteredCoins = arr;
            displayAllCoins(filteredCoins); 
            // hideUnfilteredRows(filteredCoins);
        }
        currentFocus = -1;
        console.log("arr",arr);
        filteredCoins = arr.filter(coin => coin.name.substr(0, val.length).toUpperCase() == val.toUpperCase());
        console.log(filteredCoins);
        displayAllCoins(filteredCoins);
        // hideUnfilteredRows(filteredCoins);
    });

    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}