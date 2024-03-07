import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl.json';
import { useWallet } from '@solana/wallet-adapter-react';

// Buffer globalを設定（Phantom Wallet使用時に必要な場合があります）
window.Buffer = window.Buffer || require('buffer').Buffer;

// Solanaネットワーク設定
const network = "https://api.devnet.solana.com";
const connection = new anchor.web3.Connection(network, "processed");

// スマートコントラクトのプログラムID
const programId = new PublicKey("DvgRX58pRNKfnjXQ1HQj7CzimoLE6hW4MynY1knGfVGh");

export const CreateTransaction = () => {
    const wallet = useWallet();
    const [company, setCompany] = useState("");
    const [carNumber, setCarNumber] = useState("");
    const [repairParts, setRepairParts] = useState("");
    const [message, setMessage] = useState("");

    const createTransaction = async () => {
        if (!wallet.connected) {
            setMessage("ウォレットが接続されていません。");
            return;
        }
        const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
        const program = new anchor.Program(idl, programId, provider);
        const transactionAccount = anchor.web3.Keypair.generate();

        // 修理箇所の文字列を配列に変換
        const repairPartsArray = repairParts.split(',').map(part => part.trim());

        try {
            await program.rpc.createTransaction(
                new anchor.BN(100), // amount
                company,
                carNumber,
                repairPartsArray, // 修理箇所の配列を渡す
                {
                    accounts: {
                        transaction: transactionAccount.publicKey,
                        user: wallet.publicKey,
                        systemProgram: SystemProgram.programId,
                    },
                    signers: [transactionAccount],
                }
            );

            setMessage("トランザクションが正常に作成されました。公開鍵: " + transactionAccount.publicKey.toString());
        } catch (error) {
            console.error("トランザクション作成エラー:", error);
            setMessage("トランザクションの作成に失敗しました。");
        }
    };

    return (
        <div>
            <p>{message}</p>
            <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="依頼会社" />
            <input value={carNumber} onChange={(e) => setCarNumber(e.target.value)} placeholder="車台番号" />
            <input value={repairParts} onChange={(e) => setRepairParts(e.target.value)} placeholder="修理箇所（カンマ区切り）" />
            <button onClick={createTransaction}>トランザクションを作成</button>
        </div>
    );
};