// lib/payments.ts
import { getTransferSolInstruction } from "@solana-program/system";
import {
  findAssociatedTokenPda,
  getCreateAssociatedTokenIdempotentInstruction,
  getTransferCheckedInstruction,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import type { TransactionSendingSigner } from "@solana/kit";
import { address, lamports } from "@solana/kit";

export function buildSolPaymentInstruction(
  payerSigner: TransactionSendingSigner,
  merchantAddress: string,
  solAmount: number,
) {
  return getTransferSolInstruction({
    source: payerSigner,
    destination: address(merchantAddress),
    amount: lamports(BigInt(Math.round(solAmount * 1_000_000_000))),
  });
}

const USDC_MINT_DEVNET = address(
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
);
const USDC_DECIMALS = 6;

export async function buildUsdcPaymentInstructions(
  payerSigner: TransactionSendingSigner,
  merchantAddress: string,
  usdcAmount: number,
) {
  return buildSplTokenPayment(
    payerSigner,
    merchantAddress,
    usdcAmount,
    USDC_MINT_DEVNET,
    USDC_DECIMALS,
  );
}

const SKR_MINT = address("SKRbvo6Gf7GondiT3BbTfuRDPqLWei4j2Qy2NPGZhW3");
const SKR_DECIMALS = 6;

export async function buildSkrPaymentInstructions(
  payerSigner: TransactionSendingSigner,
  merchantAddress: string,
  skrAmount: number,
) {
  return buildSplTokenPayment(
    payerSigner,
    merchantAddress,
    skrAmount,
    SKR_MINT,
    SKR_DECIMALS,
  );
}

async function buildSplTokenPayment(
  payerSigner: TransactionSendingSigner,
  merchantAddress: string,
  amount: number,
  mint: ReturnType<typeof address>,
  decimals: number,
) {
  const merchant = address(merchantAddress);

  const [sourceAta] = await findAssociatedTokenPda({
    owner: payerSigner.address,
    mint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });
  const [destinationAta] = await findAssociatedTokenPda({
    owner: merchant,
    mint,
    tokenProgram: TOKEN_PROGRAM_ADDRESS,
  });

  const createAtaIx = getCreateAssociatedTokenIdempotentInstruction({
    payer: payerSigner,
    owner: merchant,
    mint,
    ata: destinationAta,
  });

  const transferIx = getTransferCheckedInstruction({
    source: sourceAta,
    mint,
    destination: destinationAta,
    authority: payerSigner,
    amount: BigInt(Math.round(amount * 10 ** decimals)),
    decimals,
  });

  return [createAtaIx, transferIx];
}
