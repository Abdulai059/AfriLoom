// lib/payments.ts
import { address, lamports } from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

// Replace with a devnet wallet address you control — this is where
// payments land for the demo. You can create one in Phantom/Solflare
// and switch it to devnet.
const MERCHANT_WALLET = address("PASTE_YOUR_DEVNET_WALLET_ADDRESS_HERE");

export function buildSolPaymentInstruction(
  payerAddress: string,
  solAmount: number,
) {
  return getTransferSolInstruction({
    source: address(payerAddress),
    destination: MERCHANT_WALLET,
    amount: lamports(BigInt(Math.round(solAmount * 1_000_000_000))),
  });
}
