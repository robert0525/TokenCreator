document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("token-form");


    if (!form) {
        console.error("🚨 ERROR: Form with ID 'create-token-form' not found! Check your HTML.");
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Get values from input fields
        const tokenName = document.getElementById("token-name").value;
        const tokenSymbol = document.getElementById("token-symbol").value;
        const decimals = document.getElementById("decimals").value;
        const totalSupply = document.getElementById("total-supply").value;
        const imageFile = document.getElementById("token-image").files[0];
        const projectWebsite = document.getElementById("project-website").value;
        const twitterLink = document.getElementById("twitter-link").value;
        const telegramLink = document.getElementById("telegram-link").value;

        if (!imageFile) {
            alert("Please upload a token image.");
            return;
        }

        // Upload the image to IPFS (Replace this function with actual API call)
        const imageUrl = await uploadImageToIPFS(imageFile);
        if (!imageUrl) {
            alert("Failed to upload image.");
            return;
        }

        // Prepare token data
        const tokenData = {
            name: tokenName,
            symbol: tokenSymbol,
            decimals: parseInt(decimals),
            supply: parseInt(totalSupply),
            imageUrl: imageUrl,
            projectWebsite: projectWebsite,
            twitterLink: twitterLink,
            telegramLink: telegramLink,
        };

        console.log("✅ Sending token data to server:", tokenData);

        try {
            // Send request to Netlify function
            const response = await fetch("/.netlify/functions/createToken", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tokenData),
            });

            const responseData = await response.json();

            if (response.ok) {
                alert(`🎉 Token Created Successfully! Mint Address: ${responseData.mintAddress}`);
                console.log("✅ Token creation response:", responseData);
            } else {
                throw new Error(responseData.error || "Unknown error occurred.");
            }
        } catch (error) {
            console.error("❌ Error creating token:", error);
            alert("⚠️ Failed to create token. Check the console for details.");
        }
    });
});

// Function to upload image to IPFS (Dummy implementation, replace with actual API)
async function uploadImageToIPFS(imageFile) {
    try {
        const formData = new FormData();
        formData.append("file", imageFile);

        const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
            method: "POST",
            headers: {
                "Authorization": `Bearer YOUR_PINATA_API_KEY`,
            },
            body: formData,
        });

        const data = await response.json();
        return `https://ipfs.io/ipfs/${data.IpfsHash}`;
    } catch (error) {
        console.error("❌ IPFS Upload Failed:", error);
        return null;
    }
}
