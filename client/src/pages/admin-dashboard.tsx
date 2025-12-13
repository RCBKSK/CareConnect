
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Shield, Users, Building, Trash2, Edit, Plus, Tag, DollarSign } from "lucide-react";
import type { User, ProviderWithUser, PromoCode, ProviderPricingOverride } from "@shared/schema";
import { useLocation } from "wouter";

const adminProviderSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  city: z.string().min(2),
  type: z.enum(["physiotherapist", "doctor", "nurse"]),
  specialization: z.string().min(3),
  bio: z.string().min(50),
  yearsExperience: z.coerce.number().min(0).max(50),
  education: z.string().min(3),
  consultationFee: z.coerce.number().min(1),
  homeVisitFee: z.coerce.number().optional(),
  languages: z.array(z.string()).min(1),
  availableDays: z.array(z.string()).min(1),
});

type AdminProviderData = z.infer<typeof adminProviderSchema>;

const languageOptions = [
  { value: "english", label: "English" },
  { value: "hungarian", label: "Hungarian" },
  { value: "german", label: "German" },
  { value: "french", label: "French" },
];



// Pricing Management Component
function PricingManagement({ providers }: { providers: ProviderWithUser[] }) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: pricingOverrides, refetch } = useQuery<ProviderPricingOverride[]>({
    queryKey: ["/api/admin/pricing-overrides"],
  });

  const pricingForm = useForm<{
    providerId: string;
    consultationFee?: number;
    homeVisitFee?: number;
    discountPercentage?: number;
    notes?: string;
  }>({
    defaultValues: {
      providerId: "",
      consultationFee: undefined,
      homeVisitFee: undefined,
      discountPercentage: undefined,
      notes: "",
    },
  });

  const createPricingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(editingId ? "PATCH" : "POST", 
        editingId ? `/api/admin/pricing-overrides/${editingId}` : "/api/admin/pricing-overrides", 
        data
      );
      if (!response.ok) throw new Error("Failed to save pricing override");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: editingId ? "Pricing updated!" : "Pricing override created!" });
      pricingForm.reset();
      setEditingId(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePricingMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/pricing-overrides/${id}`);
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Pricing override deleted" });
      refetch();
    },
  });

  const onSubmit = (data: any) => {
    createPricingMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Form {...pricingForm}>
        <form onSubmit={pricingForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={pricingForm.control}
              name="providerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {providers.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.user.firstName} {p.user.lastName} - {p.specialization}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={pricingForm.control}
              name="consultationFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Consultation Fee ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </FormControl>
                  <FormDescription>Leave empty to use provider's default</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={pricingForm.control}
              name="homeVisitFee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Home Visit Fee ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </FormControl>
                  <FormDescription>Leave empty to use provider's default</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={pricingForm.control}
              name="discountPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Percentage (%)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" max="100" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </FormControl>
                  <FormDescription>Applies to all provider's services</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={pricingForm.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={createPricingMutation.isPending}>
              {createPricingMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">{editingId ? "Update" : "Create"} Override</span>
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); pricingForm.reset(); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4">
        <h3 className="font-semibold">Active Pricing Overrides</h3>
        {pricingOverrides?.map((override) => {
          const provider = providers.find(p => p.id === override.providerId);
          return (
            <div key={override.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{provider?.user.firstName} {provider?.user.lastName}</p>
                <div className="text-sm text-muted-foreground space-y-1">
                  {override.consultationFee && <p>Consultation: ${Number(override.consultationFee).toFixed(2)}</p>}
                  {override.homeVisitFee && <p>Home Visit: ${Number(override.homeVisitFee).toFixed(2)}</p>}
                  {override.discountPercentage && <p>Discount: {Number(override.discountPercentage)}%</p>}
                  {override.notes && <p className="italic">{override.notes}</p>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(override.id);
                    pricingForm.reset({
                      providerId: override.providerId,
                      consultationFee: override.consultationFee ? Number(override.consultationFee) : undefined,
                      homeVisitFee: override.homeVisitFee ? Number(override.homeVisitFee) : undefined,
                      discountPercentage: override.discountPercentage ? Number(override.discountPercentage) : undefined,
                      notes: override.notes || "",
                    });
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deletePricingMutation.mutate(override.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Promo Code Management Component
function PromoCodeManagement({ providers }: { providers: ProviderWithUser[] }) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: promoCodes, refetch } = useQuery<PromoCode[]>({
    queryKey: ["/api/admin/promo-codes"],
  });

  const promoForm = useForm<{
    code: string;
    description: string;
    discountType: "percentage" | "fixed";
    discountValue: number;
    maxUses?: number;
    validFrom: string;
    validUntil: string;
    applicableProviders?: string[];
    minAmount?: number;
  }>({
    defaultValues: {
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      maxUses: undefined,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      applicableProviders: [],
      minAmount: undefined,
    },
  });

  const createPromoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(editingId ? "PATCH" : "POST",
        editingId ? `/api/admin/promo-codes/${editingId}` : "/api/admin/promo-codes",
        data
      );
      if (!response.ok) throw new Error("Failed to save promo code");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: editingId ? "Promo code updated!" : "Promo code created!" });
      promoForm.reset();
      setEditingId(null);
      refetch();
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const deletePromoMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/promo-codes/${id}`);
      if (!response.ok) throw new Error("Failed to delete");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Promo code deleted" });
      refetch();
    },
  });

  const onSubmit = (data: any) => {
    createPromoMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <Form {...promoForm}>
        <form onSubmit={promoForm.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={promoForm.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Promo Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="SUMMER2024" onChange={e => field.onChange(e.target.value.toUpperCase())} />
                  </FormControl>
                  <FormDescription>Will be converted to uppercase</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={promoForm.control}
              name="discountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={promoForm.control}
              name="discountValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount Value</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormDescription>
                    {promoForm.watch("discountType") === "percentage" ? "Percentage (0-100)" : "Dollar amount"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={promoForm.control}
              name="maxUses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Uses (Optional)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} />
                  </FormControl>
                  <FormDescription>Leave empty for unlimited</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={promoForm.control}
              name="validFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid From</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={promoForm.control}
              name="validUntil"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valid Until</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={promoForm.control}
              name="minAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Amount ($)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} value={field.value || ""} onChange={e => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} />
                  </FormControl>
                  <FormDescription>Minimum booking amount required</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={promoForm.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2">
            <Button type="submit" disabled={createPromoMutation.isPending}>
              {createPromoMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              <span className="ml-2">{editingId ? "Update" : "Create"} Promo Code</span>
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={() => { setEditingId(null); promoForm.reset(); }}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>

      <div className="space-y-4">
        <h3 className="font-semibold">Active Promo Codes</h3>
        {promoCodes?.map((promo) => (
          <div key={promo.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-mono font-bold text-lg">{promo.code}</p>
                <span className={`text-xs px-2 py-1 rounded ${promo.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {promo.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{promo.description}</p>
              <div className="text-sm text-muted-foreground mt-2 space-y-1">
                <p>
                  Discount: {promo.discountType === "percentage" 
                    ? `${Number(promo.discountValue)}%` 
                    : `$${Number(promo.discountValue)}`}
                </p>
                <p>Valid: {new Date(promo.validFrom).toLocaleDateString()} - {new Date(promo.validUntil).toLocaleDateString()}</p>
                {promo.maxUses && <p>Uses: {promo.usedCount || 0} / {promo.maxUses}</p>}
                {promo.minAmount && <p>Min Amount: ${Number(promo.minAmount)}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingId(promo.id);
                  promoForm.reset({
                    code: promo.code,
                    description: promo.description || "",
                    discountType: promo.discountType as "percentage" | "fixed",
                    discountValue: Number(promo.discountValue),
                    maxUses: promo.maxUses || undefined,
                    validFrom: new Date(promo.validFrom).toISOString().split('T')[0],
                    validUntil: new Date(promo.validUntil).toISOString().split('T')[0],
                    minAmount: promo.minAmount ? Number(promo.minAmount) : undefined,
                  });
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deletePromoMutation.mutate(promo.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const dayOptions = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const { data: providers } = useQuery<ProviderWithUser[]>({
    queryKey: ["/api/providers"],
  });

  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: user?.role === "admin",
  });

  const form = useForm<AdminProviderData>({
    resolver: zodResolver(adminProviderSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      type: "physiotherapist",
      specialization: "",
      bio: "",
      yearsExperience: 0,
      education: "",
      consultationFee: 50,
      homeVisitFee: undefined,
      languages: ["english"],
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
    },
  });

  const createProviderMutation = useMutation({
    mutationFn: async (data: AdminProviderData) => {
      const response = await apiRequest("POST", "/api/admin/providers", data);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create provider");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Provider created!",
        description: "The provider has been successfully added.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/providers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create provider",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const onSubmit = (data: AdminProviderData) => {
    createProviderMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage service providers and users</p>
            </div>
          </div>

          <Tabs defaultValue="create-provider" className="space-y-6">
            <TabsList className="grid grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="create-provider">
                <Building className="h-4 w-4 mr-2" />
                Create Provider
              </TabsTrigger>
              <TabsTrigger value="providers">
                <Users className="h-4 w-4 mr-2" />
                All Providers ({providers?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="h-4 w-4 mr-2" />
                All Users ({users?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="pricing">
                <Building className="h-4 w-4 mr-2" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="promo-codes">
                <Building className="h-4 w-4 mr-2" />
                Promo Codes
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create-provider">
              <Card>
                <CardHeader>
                  <CardTitle>Add New Provider</CardTitle>
                  <CardDescription>
                    Create a new healthcare provider account with full profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Provider Type</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="physiotherapist">Physiotherapist</SelectItem>
                                  <SelectItem value="doctor">Doctor</SelectItem>
                                  <SelectItem value="nurse">Home Nurse</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="specialization"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Specialization</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="yearsExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience</FormLabel>
                              <FormControl>
                                <Input type="number" min={0} max={50} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="education"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Education</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="consultationFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Consultation Fee ($)</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="homeVisitFee"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Home Visit Fee ($) - Optional</FormLabel>
                              <FormControl>
                                <Input type="number" min={1} {...field} value={field.value || ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea className="min-h-24" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="languages"
                        render={() => (
                          <FormItem>
                            <FormLabel>Languages</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {languageOptions.map((lang) => (
                                <FormField
                                  key={lang.value}
                                  control={form.control}
                                  name="languages"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(lang.value)}
                                          onCheckedChange={(checked) => {
                                            const updated = checked
                                              ? [...(field.value || []), lang.value]
                                              : field.value?.filter((v) => v !== lang.value) || [];
                                            field.onChange(updated);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {lang.label}


            <TabsContent value="pricing">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Pricing Overrides</CardTitle>
                  <CardDescription>Set custom pricing for specific providers</CardDescription>
                </CardHeader>
                <CardContent>
                  <PricingManagement providers={providers || []} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="promo-codes">
              <Card>
                <CardHeader>
                  <CardTitle>Promo Codes & Discounts</CardTitle>
                  <CardDescription>Manage promotional codes and discount campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <PromoCodeManagement providers={providers || []} />
                </CardContent>
              </Card>
            </TabsContent>

                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availableDays"
                        render={() => (
                          <FormItem>
                            <FormLabel>Available Days</FormLabel>
                            <div className="grid grid-cols-2 gap-2">
                              {dayOptions.map((day) => (
                                <FormField
                                  key={day.value}
                                  control={form.control}
                                  name="availableDays"
                                  render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(day.value)}
                                          onCheckedChange={(checked) => {
                                            const updated = checked
                                              ? [...(field.value || []), day.value]
                                              : field.value?.filter((v) => v !== day.value) || [];
                                            field.onChange(updated);
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer">
                                        {day.label}
                                      </FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="submit"
                        size="lg"
                        disabled={createProviderMutation.isPending}
                        className="w-full"
                      >
                        {createProviderMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Provider"
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="providers">
              <Card>
                <CardHeader>
                  <CardTitle>All Providers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {providers?.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {provider.user.firstName} {provider.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{provider.specialization}</p>
                          <p className="text-xs text-muted-foreground">{provider.user.city}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/provider/${provider.id}`)}>
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>All Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-muted rounded">{user.role}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
