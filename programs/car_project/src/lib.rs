use anchor_lang::prelude::*;

declare_id!("7Pq5TUjE35aTii9LRBDZAAsFH66Zwi8AVuf1KxmoH2qZ");

#[program]
pub mod car_project {
    use super::*;
    pub fn create_transaction(ctx: Context<CreateTransaction>, amount: u64) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.amount = amount;
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
    pub approved: bool,
}

#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    #[account(init, payer = user, space = 8 + 64)]
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
