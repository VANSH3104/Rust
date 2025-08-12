use solana_program::{
    account_info::{next_account_info , AccountInfo}, entrypoint::{self, ProgramResult}, msg, program::invoke_signed, pubkey::Pubkey,
    system_instruction::create_account
};

fn program_instruction(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
)-> ProgramResult {
    let account_itr = &mut accounts.iter();
    let pda = next_account_info(account_itr)?;
    let user_acc = next_account_info(account_itr)?;
    let System_program = next_account_info(account_itr)?;
    let seed = &[user_acc.key.as_ref(), b"user"];

    let ix = create_account(
        user_acc.key,
        pda.key,
        1000000000,
        8,
        _program_id
    );
    invoke_signed(ix, accounts, &[seed])
}