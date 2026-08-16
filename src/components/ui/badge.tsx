import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-stone-900 text-white hover:bg-stone-800',
        brand: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
        secondary: 'border-transparent bg-stone-100 text-stone-900 hover:bg-stone-200',
        destructive: 'border-transparent bg-rose-100 text-rose-800 hover:bg-rose-200',
        outline: 'text-stone-950 border-stone-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
