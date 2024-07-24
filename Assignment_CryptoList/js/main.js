document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display all coins
    const coinsFetch = await fetchAllCoins(1);
    
    if(coinsFetch){
        modalFunction("myModal", "myBtn", "close");
        filteredCoins = allCoins;
        const isTableCreated = createAllCoinTable(filteredCoins);
        if(isTableCreated){
            displayAllCoins(filteredCoins);
            loadStarCoins(); 
        }
    }
    else{
        console.log("Error while fetching coins");
    }
    // Load and display star coins
});

function modalFunction(modalId, openBtnId, closeBtn){
    // Get the modal
    var modal = document.getElementById(modalId);

    // Get the button that opens the modal
    var btn = document.getElementById(openBtnId);

    // Get the <span> element that closes the modal
    var span = document.querySelector(`.${closeBtn}`);

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}
const updateChange24h = (changeElement, change) => {
    if (changeElement) {
        changeElement.innerHTML = '';

        const icon = document.createElement('i');
        icon.classList.add('fas', 'fa-fw');

        if (change > 0) {
            icon.classList.add('fa-caret-up');
            changeElement.style.color = 'green';
        } else {
            icon.classList.add('fa-caret-down');
            changeElement.style.color = 'red';
            change =  -change;
        }

        changeElement.appendChild(icon);
        changeElement.append(`${change.toFixed(2)}%`);
    }
}