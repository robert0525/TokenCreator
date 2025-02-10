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
        // Parse form data from request body
        const { tokenName, tokenSymbol, totalSupply } = JSON.parse(event.body);

        // Connect to Solana Devnet
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Load private key from environment variable
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

        // Create an associated token account for the mint
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            wallet.publicKey
        );

        // Mint the total supply to the token account
        await mintTo(
            connection,
            wallet,
            mint,
            tokenAccount.address,
            wallet.publicKey,
            totalSupply * Math.pow(10, 9)
        );

        // Success response
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Token created successfully!",
                mintAddress: mint.toBase58(),
                tokenAccount: tokenAccount.address.toBase58(),
                totalSupply: totalSupply,
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

    }
};
