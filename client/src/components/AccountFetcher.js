import React, { useState } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';

export function AccountFetcher() {
    const [pubkey, setPubkey] = useState('');
    const [decodedData, setDecodedData] = useState('');
    const [fetchError, setFetchError] = useState('');

    const decodeData = (encodedData) => {
        try {
            const prefixRemoved = encodedData.replace('Cxiugct18hdk', '');
            const buffer = Buffer.from(prefixRemoved, 'base64');
            let decodedString = buffer.toString('utf-8');

            // 不要な文字や制御文字を除去し、JSON形式に近い部分を抽出する正規表現
            const jsonRegex = /{.*}/;
            const found = decodedString.match(jsonRegex);

            if (found) {
                const json = JSON.parse(found[0]);
                console.log(json);
                return JSON.stringify(json, null, 2); // 整形して返す
            } else {
                throw new Error('有効なJSONデータが見つかりませんでした。');
            }
        } catch (error) {
            console.error('データのデコードまたはパース中にエラーが発生しました:', error);
            return `データのデコードまたはパース中にエラーが発生しました。エラー: ${error.message}`;
        }
    };

    const fetchAccountInfo = async () => {
        try {
            const connection = new Connection("https://api.devnet.solana.com");
            const publicKey = new PublicKey(pubkey);
            const accountInfo = await connection.getAccountInfo(publicKey);

            if (accountInfo) {
                const data = accountInfo.data.toString('base64');
                const decoded = decodeData(data);
                setDecodedData(decoded);
                setFetchError('');
            } else {
                setFetchError('アカウント情報が見つかりません。');
            }
        } catch (error) {
            console.error('アカウント情報の取得中にエラーが発生しました:', error);
            setFetchError('アカウント情報の取得中にエラーが発生しました。');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchAccountInfo();
    };

    return (
        <div>
            <h1>Solanaアカウント情報取得</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    公開鍵:
                    <input type="text" value={pubkey} onChange={(e) => setPubkey(e.target.value)} />
                </label>
                <button type="submit">取得</button>
            </form>

            {fetchError && <p style={{ color: 'red' }}>{fetchError}</p>}
            {decodedData && <div><h2>デコード済みデータ</h2><p>{decodedData}</p></div>}
        </div>
    );
}
