use anchor_lang::prelude::*;

declare_id!("BzuhzvGS4yqCofwtpHvZgRw4muL421DhkmNEZ5kbejJF");
#[program]
pub mod car_project {
    use super::*;
    pub fn create_transaction(ctx: Context<CreateTransaction>, amount: u64, json: String) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.amount = amount;
        transaction.json = json;
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
    pub json: String,
    pub approved: bool,
}

#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    #[account(init, payer = user, space = 4096)]
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