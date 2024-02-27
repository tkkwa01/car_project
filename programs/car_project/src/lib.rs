use anchor_lang::prelude::*;

declare_id!("vYwntHTfMyfyzMkc2r5XzmGxuWagLCdb555LfVcukLs");

#[program]
pub mod car_project {
    use super::*;
    pub fn create_transaction(ctx: Context<CreateTransaction>, amount: u64, company: String, car_number: String, repair_parts: Vec<String>) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.amount = amount;
        transaction.company = company;
        transaction.car_number = car_number;
        transaction.repair_parts = repair_parts;
        transaction.approved = false;
        Ok(())
    }

    pub fn approve_transaction(ctx: Context<ApproveTransaction>) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.approved = true;
        Ok(())
    }
}

#[account]
pub struct Transaction {
    pub amount: u64,
    pub company: String,
    pub car_number: String,
    pub repair_parts: Vec<String>,
    pub approved: bool,
}

#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    #[account(init, payer = user, space = 8 + 64 + 32 + 32 + (32 + 4*10)*10)]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveTransaction<'info> {
    #[account(mut)]
    pub transaction: Account<'info, Transaction>,
}
