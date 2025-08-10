import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Transaction
} from "@solana/web3.js";

const conn = new Connection("http://127.0.0.1:8899");

async function main() {
  const kp = new Keypair();        // payer
  const dataAccount = new Keypair(); // new account

  // Airdrop more than enough SOL to cover account creation + fees
  const signature = await conn.requestAirdrop(kp.publicKey, 2 * LAMPORTS_PER_SOL);
  await conn.confirmTransaction(signature);

  // Get minimum lamports needed for rent exemption
  const minRent = await conn.getMinimumBalanceForRentExemption(8);

  console.log(`Payer balance: ${await conn.getBalance(kp.publicKey)} lamports`);
  console.log(`Min rent exemption: ${minRent} lamports`);

  // Create account instruction
  const instruction = SystemProgram.createAccount({
    fromPubkey: kp.publicKey,
    newAccountPubkey: dataAccount.publicKey,
    lamports: minRent, // exactly what is needed
    space: 8,
    programId: SystemProgram.programId
  });

  // Create and send transaction
  const trx = new Transaction().add(instruction);
  trx.feePayer = kp.publicKey;
  trx.recentBlockhash = (await conn.getLatestBlockhash()).blockhash;

  const txSig = await conn.sendTransaction(trx, [kp, dataAccount]);
  await conn.confirmTransaction(txSig);

  console.log(`New account created: ${dataAccount.publicKey.toBase58()}`);
  console.log(`Transaction: ${txSig}`);
}

main().catch(console.error);
