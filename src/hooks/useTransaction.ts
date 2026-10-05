// hooks/useTransaction.ts
import { useQuery } from "@tanstack/react-query";
import { useMobileWallet } from "@wallet-ui/react-native-kit";
import { signature as toSignature } from "@solana/kit";

export function useTransaction(signatureString: string | undefined) {
  const { client } = useMobileWallet();

  return useQuery({
    queryKey: ["transaction", signatureString],
    queryFn: async () => {
      const sig = toSignature(signatureString!);

      const tx = await client.rpc
        .getTransaction(sig, {
          maxSupportedTransactionVersion: 0,
          encoding: "jsonParsed",
        })
        .send();

      if (!tx) throw new Error("Transaction not found yet");
      return tx;
    },
    enabled: !!signatureString,
    refetchInterval: (query) => (query.state.data ? false : 2000),
    retry: 5,
  });
}
