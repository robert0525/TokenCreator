document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("create-token-form");

    form.addEventListener("submit", async function(event) {
        event.preventDefault();

        // Get values from input fields
        const tokenName = document.getElementById("token-name").value;
        const tokenSymbol = document.getElementById("token-symbol").value;
        const totalSupply = document.getElementById("total-supply").value;
        const decimals = document.getElementById("decimals").value;
        const imageFile = document.getElementById("image-upload").files[0];
        const projectWebsite = document.getElementById("project-website").value;
        const twitterLink = document.getElementById("twitter-link").value;
        const telegramLink = document.getElementById("telegram-link").value;

        if (!imageFile) {
            alert("Please upload a token image.");
            return;
        }

        try {
            // Upload the image to IPFS
            const imageUrl = await uploadImageToIPFS(imageFile);
            if (!imageUrl) {
                alert("Failed to upload image.");
                return;
            }

            // Prepare request data
            const tokenData = {
                name: tokenName,
                symbol: tokenSymbol,
                decimals: parseInt(decimals),
                totalSupply: parseInt(totalSupply),
                imageUrl: imageUrl, // Uploaded image URL
                projectWebsite: projectWebsite,
                twitterLink: twitterLink,
                telegramLink: telegramLink
            };

            console.log("Token Data:", tokenData);

            // Send request to Netlify function
            const response = await fetch('/.netlify/functions/createToken', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tokenData)
            });

            const data = await response.json();
            alert(data.message);
        } catch (error) {
            console.error("Error creating token:", error);
            alert("Failed to create token. Check the console for details.");
        }
    });
});
