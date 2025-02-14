const { Connection, Keypair, clusterApiUrl, PublicKey, Transaction, sendAndConfirmTransaction, SystemProgram } = require("@solana/web3.js");
const { createMint, getOrCreateAssociatedTokenAccount, mintTo } = require("@solana/spl-token");

const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// Function to get Metadata PDA
async function getMetadataPDA(mint) {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata"),
            TOKEN_METADATA_PROGRAM_ID.toBuffer(),
            mint.toBuffer()
        ],
        TOKEN_METADATA_PROGRAM_ID
    )[0];
}

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
        const { tokenName, tokenSymbol, totalSupply, imageUrl, projectWebsite, twitterLink, telegramLink } = JSON.parse(event.body);
        console.log("Parsed event body:", { tokenName, tokenSymbol, totalSupply, imageUrl, projectWebsite, twitterLink, telegramLink });

        // Solana connection
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Load wallet from private key
        const secretKeyArray = JSON.parse(process.env.SOLANA_PRIVATE_KEY);
        const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
        console.log("Wallet Public Key:", wallet.publicKey.toBase58());

        // Create a new token mint
        const mint = await createMint(
            connection,
            wallet,
            wallet.publicKey,
            null,
            9
        );
        console.log("Mint Address:", mint.toBase58());

        // Create token account
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            wallet,
            mint,
            wallet.publicKey
        );
        console.log("Token Account Address:", tokenAccount.address.toBase58());

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

        // Get metadata PDA
        const metadataPDA = await getMetadataPDA(mint);

        // Define metadata
        const metadata = {
            name: tokenName,
            symbol: tokenSymbol,
            uri: imageUrl,  // Metadata URI (update later with a JSON metadata file)
            sellerFeeBasisPoints: 0,
            creators: null,
            collection: null,
            uses: null,
            external_url: projectWebsite || "",  // Store project website in metadata (optional)
            properties: {
                category: "token",
                files: [{ uri: imageUrl, type: "image/png" }],
                socialLinks: {
                    twitter: twitterLink || "",  // Optional social links
                    telegram: telegramLink || ""
                }
            }
        };

        // Create metadata account
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: metadataPDA,
                space: 300,
                lamports: await connection.getMinimumBalanceForRentExemption(300),
                programId: TOKEN_METADATA_PROGRAM_ID,
            })
        );

        await sendAndConfirmTransaction(connection, transaction, [wallet]);
        console.log("Metadata account created successfully!");

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Token created successfully!",
                mintAddress: mint.toBase58(),
                tokenAccount: tokenAccount.address.toBase58(),
                metadataPDA: metadataPDA.toBase58(),
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
