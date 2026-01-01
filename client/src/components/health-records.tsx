import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Upload, Trash2, FileIcon, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { HealthRecord } from "@shared/schema";

export function HealthRecordsComponent() {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { data: records = [], isLoading } = useQuery<HealthRecord[]>({
    queryKey: ["/api/health-records"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/health-records", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-records"] });
      setTitle("");
      setDescription("");
      toast({ title: "Success", description: "Health record added!" });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Upload New Record
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Blood Test Result" />
          </div>
          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Additional details..." />
          </div>
          <Button 
            className="w-full" 
            onClick={() => title && createMutation.mutate({ title, description, fileUrl: "dummy-url" })}
            disabled={createMutation.isPending || !title}
          >
            {createMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Record"}
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {records.map((record) => (
          <Card key={record.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileIcon className="h-8 w-8 text-primary/60" />
                <div>
                  <p className="font-medium">{record.title}</p>
                  <p className="text-sm text-muted-foreground">{record.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
