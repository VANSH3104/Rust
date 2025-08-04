import * as borsh from "borsh"
export class CounterAccount {
    count: number;

    constructor({count }: {count: number}){
        this.count = count;
    }
}
export const schema:borsh.Schema = {
    struct: {
        count: 'u32'
    }
}
export const counterlength = borsh.serialize(schema , new CounterAccount({count:0})).length;

export const Address = "8dvDsS3n9snvDPhQh1tWvKqLAJk3Uyjvxjv4wbFTxeCz"