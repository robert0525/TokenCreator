const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        // Parse the incoming request data
        const requestData = JSON.parse(event.body);

        const { name, symbol, decimals, supply, imageUrl, projectWebsite, twitterLink, telegramLink } = requestData;

        if (!name || !symbol || !decimals || !supply) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields." }),
            };
        }

        // Simulate token creation logic (replace with actual blockchain interaction)
        const mintAddress = `SIMULATED_MINT_ADDRESS_${Date.now()}`;

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Token Created Successfully",
                mintAddress: mintAddress,
                details: {
                    name,
                    symbol,
                    decimals,
                    supply,
                    imageUrl,
                    projectWebsite,
                    twitterLink,
                    telegramLink,
                },
            }),
        };
    } catch (error) {
        console.error("Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
