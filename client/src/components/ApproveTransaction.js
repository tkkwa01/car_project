import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import idl from '../idl.json';
import { useWallet } from '@solana/wallet-adapter-react';

// SolanaネットワークとプログラムID設定
const network = "https://api.devnet.solana.com";
const connection = new anchor.web3.Connection(network, "processed");
const programId = new PublicKey("GVtEzi8bJyHLUpWEMqXxMeW5ij7a13NbtiXXuqeZUJAf");

export const ApproveTransaction = () => {
    const wallet = useWallet();
    const [transactionPublicKey, setTransactionPublicKey] = useState("");
    const [message, setMessage] = useState("");

    const approveTransaction = async () => {
        if (!wallet.connected) {
            setMessage("ウォレットが接続されていません。");
            return;
        }
        const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
        const program = new anchor.Program(idl, programId, provider);

        try {
            await program.rpc.approveTransaction({
                accounts: {
                    transaction: new PublicKey(transactionPublicKey),
                    user: provider.wallet.publicKey,
                },
            });

            setMessage("トランザクションが正常に承認されました。");
        } catch (error) {
            console.error("トランザクション承認エラー:", error);
            setMessage("トランザクションの承認に失敗しました。");
        }
    };

    return (
        <div>
            <p>{message}</p>
            <input value={transactionPublicKey} onChange={(e) => setTransactionPublicKey(e.target.value)} placeholder="トランザクション公開鍵" />
            <button onClick={approveTransaction}>トランザクションを承認</button>
        </div>
    );
};
