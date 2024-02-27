use std::str::FromStr;
use anchor_lang::prelude::*;

declare_id!("GVtEzi8bJyHLUpWEMqXxMeW5ij7a13NbtiXXuqeZUJAf");

const ADMIN_PUBKEY: &str = "7CYKoDPjeyMJ1r34ZbcHsRYGGvF6MXBLaWF6nUrP1KQU";

#[program]
pub mod car_project {
    use super::*;

    pub fn create_transaction(ctx: Context<CreateTransaction>, amount: u64, company: String, car_number: String, repair_parts: String) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;
        transaction.amount = amount;
        transaction.company = company;
        transaction.car_number = car_number;
        transaction.repair_parts = repair_parts;
        transaction.issuer_pubkey = *ctx.accounts.user.to_account_info().key; // 業者の公開鍵をセット
        transaction.approved = false;
        Ok(())
    }
    pub fn approve_transaction(ctx: Context<ApproveTransaction>) -> Result<()> {
        let transaction = &mut ctx.accounts.transaction;

        // 管理者の確認
        let admin_pubkey = Pubkey::from_str(ADMIN_PUBKEY).unwrap();
        if ctx.accounts.user.to_account_info().key != &admin_pubkey {
            return Err(ErrorCode::Unauthorized.into());
        }

        // トランザクションの承認
        transaction.approved = true;

        Ok(())
    }
}

#[account]
pub struct Transaction {
    pub amount: u64,
    pub company: String,
    pub car_number: String,
    pub repair_parts: String,
    pub issuer_pubkey: Pubkey, // 業者の公開鍵
    pub approved: bool,
}

#[derive(Accounts)]
pub struct CreateTransaction<'info> {
    #[account(init, payer = user, space = 8 + 64 + 32 + 32 + 256 + 32 + 1)]
    pub transaction: Account<'info, Transaction>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveTransaction<'info> {
    pub transaction: Account<'info, Transaction>,
    pub user: Signer<'info>, // この場合、userは管理者である必要がある
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to approve transactions.")]
    Unauthorized,
}