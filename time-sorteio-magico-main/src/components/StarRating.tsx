import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const StarRating = ({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "md" 
}: StarRatingProps) => {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const handleStarClick = (starValue: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(starValue);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className={`p-0 h-auto hover:bg-transparent ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
          onClick={() => handleStarClick(star)}
          disabled={readonly}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= rating
                ? "fill-winner-gold text-winner-gold"
                : "text-muted-foreground hover:text-winner-gold"
            }`}
          />
        </Button>
      ))}
    </div>
  );
};