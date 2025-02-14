document.getElementById('create-token-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    // Get values from input fields
    const tokenName = document.getElementById('token-name').value;
    const tokenSymbol = document.getElementById('token-symbol').value;
    const totalSupply = document.getElementById('total-supply').value;
    const imageFile = document.getElementById('image-upload').files[0];

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
        imageUrl: imageUrl  // Using uploaded image URL
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

// Function to upload image to IPFS (example using Pinata API)
async function uploadImageToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_PINATA_API_KEY' // Replace with your API key
            },
            body: formData
        });

        const data = await response.json();
        return `https://ipfs.io/ipfs/${data.IpfsHash}`; // Return IPFS URL
    } catch (error) {
        console.error('Image upload failed:', error);
        return null;
    }
}
