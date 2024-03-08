// ApproveTransaction.js
import React, { useState, useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../idl.json';

const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");
const programId = new PublicKey("4WnWM81QGcZo5iUs3dj9BtJX1ZcEPgNbaDtgjdkCKY5A");

export const ApproveTransaction = () => {
    const [wallet, setWallet] = useState(null);
    const [transactionPublicKey, setTransactionPublicKey] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Phantom Wallet接続チェック
        const checkWalletConnection = async () => {
            if (window.solana && window.solana.isPhantom) {
                try {
                    const response = await window.solana.connect({ onlyIfTrusted: false });
                    setWallet(response);
                    setMessage("ウォレットが接続されました。");
                } catch (error) {
                    console.error("ウォレット接続エラー:", error);
                    setMessage("ウォレットの接続に失敗しました。");
                }
            } else {
                setMessage("Phantom Walletが検出されませんでした。");
            }
        };

        checkWalletConnection();
    }, []);

    const approveTransaction = async () => {
        if (!wallet || !transactionPublicKey) {
            setMessage("ウォレットが接続されていないか、トランザクション公開鍵が指定されていません。");
            return;
        }

        const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
        const program = new anchor.Program(idl, programId, provider);

        try {
            await program.rpc.approveTransaction({
                accounts: {
                    transaction: new PublicKey(transactionPublicKey),
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
            <input
                value={transactionPublicKey}
                onChange={(e) => setTransactionPublicKey(e.target.value)}
                placeholder="トランザクション公開鍵"
            />
            <button onClick={approveTransaction}>トランザクションを承認</button>
        </div>
    );
};
