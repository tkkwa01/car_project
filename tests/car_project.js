const assert = require('assert');
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const main = async() => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.CarProject;
    const transactionAccount = anchor.web3.Keypair.generate();

    // トランザクションの作成に必要な追加の引数を含む
    await program.rpc.createTransaction(
        new anchor.BN(100), "CompanyA", "CAR123", ["Wheel", "BrakePad"], {
            accounts: {
                transaction: transactionAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            },
            signers: [transactionAccount],
        });

    // トランザクションのデータを取得し、検証
    let transaction = await program.account.transaction.fetch(
        transactionAccount.publicKey
    );

    // トランザクションの全内容を確認
    console.log(JSON.stringify(transaction, null, 2));

    assert.ok(transaction.amount.eq(new anchor.BN(100)));
    assert.ok(transaction.company === "CompanyA");
    assert.ok(transaction.carNumber === "CAR123");
    assert.ok(transaction.repairParts.length === 2);
    assert.ok(transaction.repairParts.includes("Wheel"));
    assert.ok(transaction.repairParts.includes("BrakePad"));
    assert.ok(transaction.approved === false);

    // トランザクションの承認
    await program.rpc.approveTransaction({
        accounts: {
            transaction: transactionAccount.publicKey,
        },
    });

    // 承認後のトランザクションのデータを取得し、検証
    transaction = await program.account.transaction.fetch(
        transactionAccount.publicKey
    );
    assert.ok(transaction.approved === true);
};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

runMain();