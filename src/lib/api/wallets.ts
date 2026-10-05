// api/wallets.ts
import { supabase } from "@/lib/supabase";

export type CreatorWallet = {
  id: string;
  creator_id: string;
  currency: "sol" | "usdc" | "skr";
  wallet_address: string;
  is_default: boolean;
};

export async function fetchCreatorWallets(creatorId: string) {
  const { data, error } = await supabase
    .from("creator_wallets")
    .select("*")
    .eq("creator_id", creatorId);

  if (error) throw error;
  return data as CreatorWallet[];
}

export async function fetchCreatorWalletForCurrency(
  creatorId: string,
  currency: string,
) {
  const { data, error } = await supabase
    .from("creator_wallets")
    .select("wallet_address")
    .eq("creator_id", creatorId)
    .eq("currency", currency)
    .maybeSingle();

  if (error) throw error;
  return data?.wallet_address ?? null;
}

export async function upsertCreatorWallet(
  creatorId: string,
  currency: CreatorWallet["currency"],
  walletAddress: string,
) {
  const { error } = await supabase
    .from("creator_wallets")
    .upsert(
      { creator_id: creatorId, currency, wallet_address: walletAddress },
      { onConflict: "creator_id,currency" },
    );

  if (error) throw error;
}
