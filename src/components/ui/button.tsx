// Adapted from shadcn/ui (new-york); see LICENSE.md in this directory.
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2.5 text-center font-pixel leading-relaxed select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink focus-visible:ring-2 focus-visible:ring-white disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-default',
  {
    variants: {
      variant: {
        default: 'rounded-[24px] border-3 border-ink bg-surface text-ink shadow-[0_3px_#24242433] hover:bg-accent-soft',
        primary: 'rounded-[24px] border-3 border-ink bg-accent text-ink shadow-[0_3px_#24242433] hover:bg-accent-soft',
        ghost: 'rounded-md border-0 bg-transparent text-inherit underline-offset-4 hover:underline',
        answer: 'relative rounded-none border-0 shadow-none'
      },
      size: {
        default: 'min-h-16 w-43.75 px-3 py-3 text-[20px]',
        icon: 'size-12 p-2',
        answer: 'w-1/2 px-2.5 py-0'
      }
    },
    defaultVariants: { variant: 'default', size: 'default' }
  }
);

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants> & { asChild?: boolean };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp ref={ref} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
