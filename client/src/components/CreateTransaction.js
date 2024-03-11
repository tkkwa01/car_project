import React, { useState, useEffect } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl.json';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// Solanaネットワーク設定
const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");

// スマートコントラクトのプログラムID
const programId = new PublicKey("6ViydzxXuvE2GJhVxim49BAvtx2wL8PQyA9JreJgLMdm");

export const CreateTransaction = () => {
    const [wallet, setWallet] = useState(null);
    const [message, setMessage] = useState("");
    const [json, setJson] = useState("");

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

        // 必要に応じて、get publicKey() を含める
        get publicKey() {
            return this.solanaWallet.publicKey;
        }
    }


    useEffect(() => {
        // Phantom Wallet接続チェック
        const checkWalletConnection = async () => {
            if (window.solana && window.solana.isPhantom) {
                try {
                    await window.solana.connect({ onlyIfTrusted: false });
                    // CustomWalletを使用してウォレットオブジェクトをラップ
                    const wrappedWallet = new CustomWallet(window.solana);
                    setWallet(wrappedWallet);
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

    const createTransaction = async () => {
        if (!wallet) {
            setMessage("ウォレットが接続されていません。");
            return;
        }

        try {
            // 1. ProviderとProgramの初期化
            const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
            const program = new anchor.Program(idl, programId, provider);

            // 2. 新しいトランザクションアカウントの生成
            const transactionAccount = anchor.web3.Keypair.generate();

            // 4. トランザクションの作成と送信
            const transaction = await program.rpc.createTransaction(
            new anchor.BN(100), json, {
                    accounts: {
                        transaction: transactionAccount.publicKey,
                        user: provider.wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    },
                    signers: [transactionAccount],
                }
            );
            console.log("Using user publicKey:", provider.wallet.publicKey.toString());
            console.log("Using transaction publicKey:", transactionAccount.publicKey.toString());

            // 5. トランザクションID（シグネチャ）の表示
            console.log("トランザクションID:", transaction);
            setMessage(`トランザクションが正常に作成されました。トランザクションID: ${transaction}`);
            setMessage(`トランザクションが正常に作成されました。トランザクション公開鍵: ${transactionAccount.publicKey.toString()}`);
        } catch (error) {
            console.error("トランザクション作成エラー:", error);
            setMessage("トランザクションの作成に失敗しました。");
        }
    };


    return (
        <div>
            <p>{message}</p>
            <textarea
                value={json}
                onChange={(e) => setJson(e.target.value)}
                placeholder="jsonデータ"
                style={{ width: '80%', height: '200px' }}
            />
            <button onClick={createTransaction}>トランザクションを作成</button>
        </div>
    );
};