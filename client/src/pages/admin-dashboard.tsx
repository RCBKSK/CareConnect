
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
import { Loader2, Shield, Users, Building } from "lucide-react";
import type { User, ProviderWithUser } from "@shared/schema";
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
            <TabsList>
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
