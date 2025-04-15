import * as React from "react";
import { cn } from "@/lib/utils";

interface Card3DProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  depth?: number;
  hasShadow?: boolean;
}

const Card3D = React.forwardRef<HTMLDivElement, Card3DProps>(
  ({ className, children, depth = 5, hasShadow = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group rounded-lg relative transform-gpu transition-transform duration-200 ease-out active:scale-95",
          hasShadow && "shadow-lg",
          className
        )}
        {...props}
      >
        <div className="absolute inset-0 w-full h-full bg-black rounded-lg origin-bottom transform-gpu -skew-x-12 -skew-y-6 opacity-50" 
             style={{ transformStyle: "preserve-3d", transform: `translateZ(-${depth}px)` }} />
        <div className="relative bg-background rounded-lg">{children}</div>
      </div>
    );
  }
);

Card3D.displayName = "Card3D";

export { Card3D };
