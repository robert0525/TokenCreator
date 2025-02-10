const { Connection, Keypair, clusterApiUrl, PublicKey } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");

exports.handler = async (event, context) => {
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    try {
        console.log("Function triggered!");

        // Parse form data
        const { tokenName, tokenSymbol, totalSupply } = JSON.parse(event.body);

        // Solana connection
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Load wallet from private key
        const secretKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
        const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));

        // Create a new token mint
        const mint = await createMint(
            connection,
            wallet,
            wallet.publicKey,
            null,
            9
        );

        // Create token account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            wallet.publicKey
        );

        // Mint tokens
        await mintTo(
            connection,
            wallet,
            mint,
            tokenAccount.address,
            wallet.publicKey,
            totalSupply * Math.pow(10, 9)
        );

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Token created successfully!",
                mintAddress: mint.toBase58(),
                tokenAccount: tokenAccount.address.toBase58(),
                totalSupply,
            }),
        };
    } catch (error) {
        console.error("Error creating token:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Failed to create token",
                details: error.message,
            }),
        };
    }
};
