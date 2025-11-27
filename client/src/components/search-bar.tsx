import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  className?: string;
  variant?: "hero" | "compact";
}

export function SearchBar({ className = "", variant = "hero" }: SearchBarProps) {
  const [, navigate] = useLocation();
  const [location, setLocation] = useState("");
  const [serviceType, setServiceType] = useState<string>("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (serviceType) params.set("type", serviceType);
    navigate(`/providers?${params.toString()}`);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSearch} className={`flex gap-2 ${className}`}>
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="City or area..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-9"
            data-testid="input-location-compact"
          />
        </div>
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger className="w-[180px]" data-testid="select-service-type-compact">
            <SelectValue placeholder="Service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="physiotherapist">Physiotherapy</SelectItem>
            <SelectItem value="nurse">Home Nursing</SelectItem>
            <SelectItem value="doctor">Doctor Visit</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="icon" data-testid="button-search-compact">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="flex flex-col md:flex-row gap-3 p-4 bg-background/95 backdrop-blur rounded-xl shadow-lg border">
        <div className="relative flex-1">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Enter your city or area..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-12 h-12 text-base"
            data-testid="input-location"
          />
        </div>
        <Select value={serviceType} onValueChange={setServiceType}>
          <SelectTrigger className="h-12 md:w-[220px]" data-testid="select-service-type">
            <SelectValue placeholder="Select service type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="physiotherapist">Physiotherapy</SelectItem>
            <SelectItem value="nurse">Home Nursing</SelectItem>
            <SelectItem value="doctor">Doctor Visit</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" size="lg" className="h-12 px-8" data-testid="button-search">
          <Search className="h-5 w-5 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
}
