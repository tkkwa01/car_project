// Solana Web3.js ライブラリをインポート
const solanaWeb3 = require('@solana/web3.js');

async function getAccountInfo() {
    // 使用するネットワークのエンドポイントを指定（この例ではDevnet）
    const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));

    // アカウントの公開鍵を指定
    const pubkey = new solanaWeb3.PublicKey('7tGPzo2HpJH9BD9aihSYXrQSzrNUr7ic9iGxnvgGd4K');

    // アカウント情報を取得
    const accountInfo = await connection.getAccountInfo(pubkey);

    if (accountInfo) {
        console.log(JSON.stringify({
            pubkey: pubkey.toString(),
            account: {
                lamports: accountInfo.lamports,
                data: [accountInfo.data.toString('base64'), 'base64'],
                owner: accountInfo.owner.toString(),
                executable: accountInfo.executable,
                rentEpoch: accountInfo.rentEpoch,
                space: accountInfo.data.length
            }
        }, null, 2));
    } else {
        console.log('アカウントが見つかりませんでした。');
    }
}

getAccountInfo();
