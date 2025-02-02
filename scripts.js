// Add an event listener to the form
document.getElementById('create-token-form').addEventListener('submit', function(event) {
    // Prevent form from reloading the page
    event.preventDefault();

    // Get values from the input fields
    const tokenName = document.getElementById('token-name').value;
    const tokenSymbol = document.getElementById('token-symbol').value;
    const totalSupply = document.getElementById('total-supply').value;

    // Prepare data to send to the Netlify function
    const requestData = {
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        totalSupply: totalSupply
    };

    // Send the data via a POST request to the Netlify function
    fetch('/.netlify/functions/createToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        // Show the success message returned from the function
        alert(data.message);
    })
    .catch(error => {
        // Handle any errors
        alert('Error creating token: ' + error);
    });
});
