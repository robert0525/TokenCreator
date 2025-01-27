// Add an event listener to the form
document.getElementById('create-token-form').addEventListener('submit', function(event) {
    // Prevent form from reloading the page
    event.preventDefault();

    // Get values from the input fields
    const tokenName = document.getElementById('token-name').value;
    const tokenSymbol = document.getElementById('token-symbol').value;
    const totalSupply = document.getElementById('total-supply').value;

    // Display the information in an alert (for testing purposes)
    alert(`Token Created!\nName: ${tokenName}\nSymbol: ${tokenSymbol}\nTotal Supply: ${totalSupply}`);
});
