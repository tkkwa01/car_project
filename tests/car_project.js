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
        new anchor.BN(100), "{\n" +
        "  \"pubkey\": \"7tGPzo2HpJH9BD9aihSYXrQSzrNUr7ic9iGxnvgGd4K\",\n" +
        "  \"account\": {\n" +
        "    \"lamports\": 6848640,\n" +
        "    \"data\": [\n" +
        "      \"AAA\",\n" +
        "      \"base64\"\n" +
        "    ],\n" +
        "    \"owner\": \"vYwntHTfMyfyzMkc2r5XzmGxuWagLCdb555LfVcukLs\",\n" +
        "    \"executable\": false,\n" +
        "    \"rentEpoch\": 18446744073709551615,\n" +
        "    \"space\": 856\n" +
        "  }\n" +
        "}", {
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
    assert.ok(transaction.json === "{\n" +
        "  \"pubkey\": \"7tGPzo2HpJH9BD9aihSYXrQSzrNUr7ic9iGxnvgGd4K\",\n" +
        "  \"account\": {\n" +
        "    \"lamports\": 6848640,\n" +
        "    \"data\": [\n" +
        "      \"AAA\",\n" +
        "      \"base64\"\n" +
        "    ],\n" +
        "    \"owner\": \"vYwntHTfMyfyzMkc2r5XzmGxuWagLCdb555LfVcukLs\",\n" +
        "    \"executable\": false,\n" +
        "    \"rentEpoch\": 18446744073709551615,\n" +
        "    \"space\": 856\n" +
        "  }\n" +
        "}");
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