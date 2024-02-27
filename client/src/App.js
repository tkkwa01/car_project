import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import idl from './idl.json';

// Buffer globalを設定（Phantom Wallet使用時に必要な場合があります）
window.Buffer = window.Buffer || require('buffer').Buffer;

// Solanaネットワーク設定
const network = "https://api.devnet.solana.com";
const connection = new Connection(network, "processed");

// スマートコントラクトのプログラムID
const programId = new PublicKey("GVtEzi8bJyHLUpWEMqXxMeW5ij7a13NbtiXXuqeZUJAf");

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [transactionPublicKey, setTransactionPublicKey] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState("");
  const [carNumber, setCarNumber] = useState("");
  const [repairParts, setRepairParts] = useState("");

  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana && window.solana.isPhantom) {
        setWallet(window.solana);
        try {
          await window.solana.connect({ onlyIfTrusted: true });
        } catch (error) {
          console.error("ウォレット接続エラー:", error);
          setMessage("ウォレットの接続に失敗しました。");
        }
      }
    };

    checkWalletConnection();
  }, []);

  const createTransaction = async () => {
    if (!wallet) {
      setMessage("ウォレットが接続されていません。");
      return;
    }
    const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
    const program = new anchor.Program(idl, programId, provider);

    try {
      const transactionAccount = anchor.web3.Keypair.generate();

      await program.rpc.createTransaction(
          new anchor.BN(100), // amount
          company,
          carNumber,
          repairParts, // 修理箇所のリストをそのまま渡す
          {
            accounts: {
              transaction: transactionAccount.publicKey,
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [transactionAccount],
          }
      );

      setMessage("トランザクションが正常に作成されました。公開鍵: " + transactionAccount.publicKey.toString());
      setTransactionPublicKey(transactionAccount.publicKey.toString());
    } catch (error) {
      console.error("トランザクション作成エラー:", error);
      setMessage("トランザクションの作成に失敗しました。");
    }
  };

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
          user: provider.wallet.publicKey, // approveTransaction関数にuserアカウントを追加
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
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="依頼会社"
        />
        <input
            value={carNumber}
            onChange={(e) => setCarNumber(e.target.value)}
            placeholder="車台番号"
        />
        <input
            value={repairParts}
            onChange={(e) => setRepairParts(e.target.value)}
            placeholder="修理箇所（カンマ区切り）"
        />
        <button onClick={createTransaction}>トランザクションを作成</button>
        <div>
          <input
              value={transactionPublicKey}
              onChange={(e) => setTransactionPublicKey(e.target.value)}
              placeholder="トランザクション公開鍵"
          />
          <button onClick={approveTransaction}>トランザクションを承認</button>
        </div>
      </div>
  );
};

export default App;
