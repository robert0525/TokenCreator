const { Connection, Keypair, clusterApiUrl } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        console.log("Starting token creation...");

        // Check the environment variable
        console.log("Environment Variable (SOLANA_PRIVATE_KEY):", process.env.SOLANA_PRIVATE_KEY);

        // Load private key from environment variable
        const secretKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY);

        // Log the loaded private key array to confirm
        console.log("Loaded Secret Key Array:", secretKeyArray);

        const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

        // Connect to Solana Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Create a new token mint
        const mint = await createMint(
            connection,
            wallet,
            wallet.publicKey,
            null,
            9 // Decimals
        );

        console.log("Token Mint Address:", mint.toBase58());

        // Create an associated token account for the mint
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            wallet.publicKey
        );

        console.log("Token Account Address:", tokenAccount.address.toBase58());

        // Mint the total supply to the token account
        await mintTo(
            connection,
            wallet,
            mint,
            tokenAccount.address,
            wallet.publicKey,
            1000 * Math.pow(10, 9) // Example: Mint 1000 tokens
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Token created successfully!",
                mintAddress: mint.toBase58(),
                tokenAccount: tokenAccount.address.toBase58(),
            }),
        };
    } catch (error) {
        console.error("Error creating token:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to create token", details: error.message }),
        };
    }
};
