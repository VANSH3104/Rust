import { test , expect} from "bun:test"
import * as borsh from "borsh"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Address, counterlength, schema } from "./types";
let adminAccount = Keypair.generate();
let dataAccount = Keypair.generate();
const programID = new PublicKey(Address);
test("account is initialized", async() =>{
    const connection = new Connection('http://localhost:8899' , "confirmed");
    const res = await connection.requestAirdrop(adminAccount.publicKey , 1*LAMPORTS_PER_SOL) 
    await connection.confirmTransaction(res);
    const data = await connection.getAccountInfo(adminAccount.publicKey);
    const lamposts = await connection.getMinimumBalanceForRentExemption(counterlength);
    const ix = await SystemProgram.createAccount({
        fromPubkey: adminAccount.publicKey,
        lamports:lamposts,
        space: counterlength,
        programId: programID,
        newAccountPubkey:dataAccount.publicKey
    })
    const createAccountTxn = new Transaction();
    createAccountTxn.add(ix);
    const signature = await connection.sendTransaction(createAccountTxn , [adminAccount , dataAccount])
    await connection.confirmTransaction(signature);
    const dataAccountInfo = await connection.getAccountInfo(dataAccount.publicKey);
    const counter = borsh.deserialize(schema , dataAccountInfo?.data );
    console.log(counter.count)
})
