document.addEventListener('DOMContentLoaded', async () => {
    // Fetch and display all coins
    const coinsFetch = await fetchAllCoins(1);
    
    if(coinsFetch){
        openFavModal("favModal", "favBtn", "close");
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

function openFavModal(modalId, openBtnId, closeBtnClass) {
    // Get the modal
    var modal = document.getElementById(modalId);

    // Get the button that opens the modal
    var btn = document.getElementById(openBtnId);

    // Get the <span> element that closes the modal
    var span = document.querySelector(`.${closeBtnClass}`);

    // When the user clicks on the button, open the modal
    btn.onclick = function() {
        modal.style.display = "block";
        span.focus();
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

    // Handle keyboard accessibility
    span.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            modal.style.display = "none";
        }
    });

    // Trap focus inside the modal
    modal.addEventListener('keydown', function(event) {
        const focusableElements = modal.querySelectorAll('[tabindex="0"], button');
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

