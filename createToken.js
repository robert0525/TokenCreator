// functions/createToken.js

exports.handler = async (event, context) => {
    if (event.httpMethod === "POST") {
      try {
        // Parse the incoming data
        const { tokenName, tokenSymbol, totalSupply } = JSON.parse(event.body);
  
        // You could add your token creation logic here (for Solana or other blockchains)
        // For now, we will simulate this with a success message
  
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Token Created!\nName: ${tokenName}\nSymbol: ${tokenSymbol}\nTotal Supply: ${totalSupply}`
          }),
        };
      } catch (error) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid request format" }),
        };
      }
    } else {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }
  };
  