// hooks/useCreatorWallets.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchCreatorWallets,
  fetchCreatorWalletForCurrency,
  upsertCreatorWallet,
  type CreatorWallet,
} from "@/lib/api/wallets";

export const useCreatorWallets = (creatorId: string) =>
  useQuery({
    queryKey: ["creator-wallets", creatorId],
    queryFn: () => fetchCreatorWallets(creatorId),
    enabled: !!creatorId,
  });

export const useCreatorWalletForCurrency = (
  creatorId: string | undefined,
  currency: string,
) =>
  useQuery({
    queryKey: ["creator-wallet", creatorId, currency],
    queryFn: () => fetchCreatorWalletForCurrency(creatorId!, currency),
    enabled: !!creatorId,
  });

export const useSaveCreatorWallet = (creatorId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      currency,
      walletAddress,
    }: {
      currency: CreatorWallet["currency"];
      walletAddress: string;
    }) => upsertCreatorWallet(creatorId, currency, walletAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["creator-wallets", creatorId],
      });
    },
  });
};
