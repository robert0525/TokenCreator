document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("token-form");

    if (!form) {
        console.error("🚨 ERROR: Form with ID 'token-form' not found! Check your HTML.");
        return;
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get form fields safely
        const tokenNameEl = document.getElementById("token-name");
        const tokenSymbolEl = document.getElementById("token-symbol");
        const decimalsEl = document.getElementById("decimals");
        const supplyEl = document.getElementById("supply");
        const tokenImageEl = document.getElementById("token-image");

        if (!tokenNameEl || !tokenSymbolEl || !decimalsEl || !supplyEl || !tokenImageEl) {
            console.error("🚨 ERROR: One or more input fields are missing in the HTML!");
            return;
        }

        const tokenData = {
            name: tokenNameEl.value,
            symbol: tokenSymbolEl.value,
            decimals: parseInt(decimalsEl.value),
            supply: parseInt(supplyEl.value),
            image: tokenImageEl.files[0]
        };

        console.log("✅ Token Data:", tokenData);

        try {
            const response = await createToken(tokenData);
            alert(`🎉 Token Created Successfully: ${response.txId}`);
        } catch (error) {
            console.error("❌ Error creating token:", error);
            alert("⚠️ Failed to create token. Check console for details.");
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
