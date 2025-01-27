document.getElementById('create-token-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const tokenName = document.getElementById('token-name').value;
    const tokenSymbol = document.getElementById('token-symbol').value;
    const totalSupply = document.getElementById('total-supply').value;

    alert(`Token Created!\nName: ${tokenName}\nSymbol: ${tokenSymbol}\nTotal Supply: ${totalSupply}`);
});
