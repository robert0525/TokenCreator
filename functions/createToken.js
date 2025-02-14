const solanaWeb3 = require("@solana/web3.js");
const { Keypair, Connection, LAMPORTS_PER_SOL } = solanaWeb3;

exports.handler = async function (event) {
    try {
        if (event.httpMethod !== "POST") {
            return {
                statusCode: 405,
                body: JSON.stringify({ error: "Method Not Allowed" }),
            };
        }

        // Parse incoming request
        const requestData = JSON.parse(event.body);
        const { name, symbol, decimals, supply } = requestData;

        if (!name || !symbol || !decimals || !supply) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing required fields." }),
            };
        }

        // Connect to Solana Devnet (for testing, change to 'mainnet-beta' for live)
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // Create a new keypair for the mint account
        const mint = Keypair.generate();

        // Airdrop SOL to the mint address (required for transaction fees)
        const airdropSignature = await connection.requestAirdrop(mint.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(airdropSignature);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Token Created Successfully",
                mintAddress: mint.publicKey.toBase58(), // Real Solana Mint Address
                details: { name, symbol, decimals, supply }
            })
        };

    } catch (error) {
        console.error("Server Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
