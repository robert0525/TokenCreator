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
        console.log("Parsed event body:", { tokenName, tokenSymbol, totalSupply });

        // Solana connection
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Load wallet from private key
        const secretKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
        console.log("Loaded Secret Key:", secretKeyArray);  // Debug log

        const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
        console.log("Wallet Public Key:", wallet.publicKey.toBase58());  // Debug log

        // Create a new token mint
        const mint = await createMint(
            connection,
            wallet,
            wallet.publicKey,
            null,
            9
        );
        console.log("Mint Address:", mint.toBase58());  // Debug log

        // Create token account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            wallet.publicKey
        );
        console.log("Token Account Address:", tokenAccount.address.toBase58());  // Debug log

        // Mint tokens
        await mintTo(
            connection,
            wallet,
            mint,
            tokenAccount.address,
            wallet.publicKey,
            totalSupply * Math.pow(10, 9)
        );
        console.log(`Successfully minted ${totalSupply} tokens to ${tokenAccount.address.toBase58()}`);

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
