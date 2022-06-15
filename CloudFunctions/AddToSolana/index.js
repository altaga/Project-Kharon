const solanaWeb3 = require('@solana/web3.js');
var Buffer = require('buffer/').Buffer

let secretKey = Uint8Array.from([111, 111, 137, 88, 113, 23, 95, 232, 222, 43, 224, 238, 27, 227, 30, 50, 205, 240, 22, 4, 223, 99, 282, 38, 248, 43, 233, 222, 207, 233, 239, 200, 42, 84, 223, 20, 22, 243, 254, 43, 249, 204, 233, 29, 244, 272, 221, 33, 134, 33, 55, 138, 139, 83, 47, 139, 127, 205, 8, 199, 113, 190, 32, 103]);

const programId = "JBRHgSaVSf9PNLVFBgyaFnqsEE4293e7GQnbDq9YgwU5";

const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl('devnet'),
);

let keypair = solanaWeb3.Keypair.fromSecretKey(secretKey);

// Convert address to Public Key Object
let memoPublicKey = new solanaWeb3.PublicKey(programId)
// Create a new Instruction

async function main(params) {
    var utf8encoded = (new Buffer(params.payload, 'base64')).toString('utf8');

    const instruction = new solanaWeb3.TransactionInstruction({
        keys: [],
        programId: memoPublicKey,
        data: Buffer.from(utf8encoded)
    });

    // Create a new Transaction object with the Instruction, add any other instructions here
    var transaction = new solanaWeb3.Transaction().add(instruction);

    transaction.feePayer = await keypair.publicKey;

    /*
    let airdropSignature = await connection.requestAirdrop(
        transaction.feePayer,
        solanaWeb3.LAMPORTS_PER_SOL,
    );

    */

    let res = await solanaWeb3.sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
    )

    return { 
        statusCode: 200,
        body: res
    };
}

exports.main = main;