"use client";

import { Heart } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({
  spotId,
  label = "保存",
  savedLabel = "保存済み",
  className,
  variant = "secondary",
  size = "md"
}: {
  spotId: string;
  label?: string;
  savedLabel?: string;
  className?: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}) {
  const { isSaved, toggleSpot } = useWishlist();
  const saved = isSaved(spotId);

  return (
    <Button
      type="button"
      variant={saved ? "primary" : variant}
      size={size}
      className={cn(saved ? "border-white bg-white text-slate-950" : "", className)}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleSpot(spotId);
      }}
      aria-pressed={saved}
    >
      <Heart className={cn("h-4 w-4", saved ? "fill-slate-950" : "")} />
      {size === "icon" ? (
        <span className="sr-only">{saved ? savedLabel : label}</span>
      ) : saved ? (
        savedLabel
      ) : (
        label
      )}
    </Button>
  );
}
