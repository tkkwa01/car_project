import React, { useState, useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import idl from '../idl.json';

const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");
const programId = new PublicKey("BnzBZtry7z54hcP3gUDTbHtFyKbYmDBxzrRKvqXF55HH");
export const ApproveTransaction = () => {
    const [wallet, setWallet] = useState(null);
    const [transactionPublicKey, setTransactionPublicKey] = useState("");
    const [message, setMessage] = useState("");

    class CustomWallet {
        constructor(solanaWallet) {
            this.solanaWallet = solanaWallet;
        }

        async signTransaction(tx) {
            console.log("Attempting to sign transaction", tx);
            if (typeof this.solanaWallet.signTransaction === "function") {
                return await this.solanaWallet.signTransaction(tx);
            } else {
                throw new Error("signTransaction is not a function in the provided wallet object.");
            }
        }

        get publicKey() {
            // 公開鍵を文字列として返す
            return this.solanaWallet.publicKey;
        }
    }

    useEffect(() => {
        const checkWalletConnection = async () => {
            console.log("Phantom Wallet接続チェックを開始します。");
            if (window.solana && window.solana.isPhantom) {
                try {
                    console.log("Phantom Walletが検出されました。接続を試みます。");
                    await window.solana.connect({ onlyIfTrusted: false });
                    const wrappedWallet = new CustomWallet(window.solana);
                    console.log("Connected wallet publicKey:", wrappedWallet.publicKey);
                    setWallet(wrappedWallet);
                    setMessage("ウォレットが接続されました。");
                } catch (error) {
                    console.error("ウォレット接続エラー:", error);
                    setMessage("ウォレットの接続に失敗しました。");
                }
            } else {
                console.log("Phantom Walletが検出されませんでした。");
                setMessage("Phantom Walletが検出されませんでした。");
            }
        };

        checkWalletConnection();
    }, []);

    function isValidPublicKey(key) {
        try {
            new PublicKey(key);
            return true;
        } catch (error) {
            return false;
        }
    }

    const approveTransaction = async () => {
        console.log("承認プロセスを開始します。");
        if (!wallet || !transactionPublicKey || !isValidPublicKey(transactionPublicKey)) {
            console.log("ウォレットが接続されていないか、無効なトランザクション公開鍵が指定されています。", JSON.stringify({ walletPublicKey: wallet?.publicKey?.toString(), transactionPublicKey, isValid: isValidPublicKey(transactionPublicKey) }, null, 2));
            setMessage("ウォレットが接続されていないか、無効なトランザクション公開鍵が指定されています。");
            return;
        }

        try {
            const transactionPubKey = new PublicKey(transactionPublicKey); // ここで初期化
            console.log("承認するトランザクションのPublicKey:", transactionPubKey.toString());

            const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
            const program = new anchor.Program(idl, programId, provider);

            await program.rpc.approveTransaction({
                accounts: {
                    transaction: transactionPubKey,
                },
            });
            setMessage("トランザクションが正常に承認されました。");
        } catch (error) {
            console.error("トランザクション承認エラー:", error);
            setMessage(`トランザクションの承認に失敗しました。エラー: ${error.message}`);
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
