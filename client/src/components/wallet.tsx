import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, Plus, History, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export function WalletComponent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  const topupMutation = useMutation({
    mutationFn: async (topupAmount: string) => {
      const res = await apiRequest("POST", "/api/wallet/topup", { amount: topupAmount });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setAmount("");
      toast({
        title: "Success",
        description: "Wallet topped up successfully!",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-3xl font-bold text-primary">
          ${user?.walletBalance || "0.00"}
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="topup">Top up Amount ($)</Label>
            <div className="flex gap-2">
              <Input
                id="topup"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Button 
                onClick={() => amount && topupMutation.mutate(amount)}
                disabled={topupMutation.isPending || !amount}
              >
                {topupMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
