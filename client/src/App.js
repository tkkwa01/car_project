import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import idl from './idl.json';

// ウォレットとプロバイダーの設定（例えばPhantomウォレットを使用する場合）
const wallet = window.solana;
const network = "https://api.devnet.solana.com"; // または他のSolanaネットワーク
const connection = new Connection(network, "processed");

// スマートコントラクトのプログラムID
const programId = new PublicKey("7Pq5TUjE35aTii9LRBDZAAsFH66Zwi8AVuf1KxmoH2qZ");

async function createTransaction() {
  const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  const program = new anchor.Program(idl, programId, provider);

  const transactionAccount = anchor.web3.Keypair.generate();

  await program.rpc.createTransaction(new anchor.BN(100), {
    accounts: {
      transaction: transactionAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [transactionAccount],
  });

  console.log('Transaction created');
}

async function approveTransaction(transactionPublicKey) {
  const provider = new anchor.AnchorProvider(connection, wallet, anchor.AnchorProvider.defaultOptions());
  const program = new anchor.Program(idl, programId, provider);

  await program.rpc.approveTransaction({
    accounts: {
      transaction: transactionPublicKey,
    },
  });

  console.log('Transaction approved');
}

const App = () => {
  useEffect(() => {
    if (wallet.connected) {
      createTransaction();
      // approveTransactionを呼び出す際は、対象のtransactionPublicKeyを指定してください。
    }
  }, [wallet.connected]);

  return (
      <div>
        <button onClick={createTransaction}>Create Transaction</button>
        {/* Approve Transaction ボタンは、適切なtransactionPublicKeyをパラメータとして渡す必要があります。 */}
      </div>
  );
};

export default App;
