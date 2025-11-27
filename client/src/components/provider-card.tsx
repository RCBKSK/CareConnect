import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Clock, CheckCircle, Video, Home } from "lucide-react";
import type { ProviderWithUser } from "@shared/schema";

interface ProviderCardProps {
  provider: ProviderWithUser;
  nextAvailable?: string;
}

export function ProviderCard({ provider, nextAvailable }: ProviderCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "physiotherapist":
        return "Physiotherapist";
      case "nurse":
        return "Home Nurse";
      case "doctor":
        return "Doctor";
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "physiotherapist":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "nurse":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      case "doctor":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getInitials = () => {
    return `${provider.user.firstName?.charAt(0) || ""}${provider.user.lastName?.charAt(0) || ""}`.toUpperCase();
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-provider-${provider.id}`}>
      <CardContent className="p-0">
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={provider.user.avatarUrl || undefined} alt={provider.user.firstName} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                {getInitials()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-lg truncate">
                  {provider.user.firstName} {provider.user.lastName}
                </h3>
                {provider.isVerified && (
                  <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{provider.specialization}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className={`text-xs ${getTypeColor(provider.type)}`}>
                  {getTypeLabel(provider.type)}
                </Badge>
                {provider.yearsExperience && provider.yearsExperience > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {provider.yearsExperience}+ years exp.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{Number(provider.rating).toFixed(1)}</span>
              <span className="text-muted-foreground">({provider.totalReviews} reviews)</span>
            </div>
            {provider.user.city && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span className="truncate max-w-[120px]">{provider.user.city}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Video className="h-4 w-4" />
              <span>Online</span>
            </div>
            {provider.homeVisitFee && (
              <div className="flex items-center gap-1 text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>Home Visit</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Starting from</p>
              <p className="text-lg font-semibold">${Number(provider.consultationFee).toFixed(0)}</p>
            </div>
            <div className="text-right">
              {nextAvailable && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                  <span>Next: {nextAvailable}</span>
                </div>
              )}
              <Button asChild size="sm" data-testid={`button-book-${provider.id}`}>
                <Link href={`/provider/${provider.id}`}>Book Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProviderCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 w-24 bg-muted rounded animate-pulse" />
          <div className="h-4 w-20 bg-muted rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t">
          <div className="h-6 w-16 bg-muted rounded animate-pulse" />
          <div className="h-9 w-24 bg-muted rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}
