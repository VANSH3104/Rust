use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
};

#[derive(BorshSerialize, BorshDeserialize, Debug)]
struct Counter {
    count: u32,
}

#[derive(BorshSerialize, BorshDeserialize, Debug)]
enum InstructionType {
    Increment(u32),
    Decrement(u32),
}

entrypoint!(counter_contract);

pub fn counter_contract(
    _program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let acc = next_account_info(accounts_iter)?;

    let instruction_type = InstructionType::try_from_slice(instruction_data)?;
    let mut counter = Counter::try_from_slice(&acc.data.borrow())?;

    match instruction_type {
        InstructionType::Increment(value) => {
            msg!("Incrementing by {}", value);
            counter.count += value;
        }
        InstructionType::Decrement(value) => {
            msg!("Decrementing by {}", value);
            counter.count -= value;
        }
    }

    counter.serialize( &mut *acc.data.borrow_mut())?;

    Ok(())
}
