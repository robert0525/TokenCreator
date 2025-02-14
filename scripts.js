document.getElementById('create-token-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get values from input fields
    const tokenName = document.getElementById('token-name').value;
    const tokenSymbol = document.getElementById('token-symbol').value;
    const totalSupply = document.getElementById('total-supply').value;
    const imageFile = document.getElementById('image-upload').files[0];
    const projectWebsite = document.getElementById('project-website').value;
    const twitterLink = document.getElementById('twitter-link').value;
    const telegramLink = document.getElementById('telegram-link').value;

    if (!imageFile) {
        alert("Please upload a token image.");
        return;
    }

    // Upload the image to IPFS
    const imageUrl = await uploadImageToIPFS(imageFile);
    if (!imageUrl) {
        alert("Failed to upload image.");
        return;
    }

    // Prepare request data
    const requestData = {
        tokenName: tokenName,
        tokenSymbol: tokenSymbol,
        totalSupply: totalSupply,
        imageUrl: imageUrl,  // Uploaded image URL
        projectWebsite: projectWebsite,
        twitterLink: twitterLink,
        telegramLink: telegramLink
    };

    // Send request to Netlify function
    fetch('/.netlify/functions/createToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        alert('Error creating token: ' + error);
    });
});
