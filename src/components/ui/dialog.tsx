// Adapted from shadcn/ui (new-york); see LICENSE.md in this directory.
import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;
const DialogClose = DialogPrimitive.Close;

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80" />
    <DialogPrimitive.Content ref={ref}
      className={cn('dialog-panel fixed top-1/2 left-1/2 z-50 grid max-h-[calc(100dvh_-_32px)] w-[min(calc(100%_-_32px),420px)] -translate-x-1/2 -translate-y-1/2 justify-items-center gap-4 overflow-y-auto rounded-[24px] border-3 border-ink bg-surface p-6 text-center text-ink outline-none short:gap-2 short:px-5 short:py-3', className)}
      {...props}>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => <DialogPrimitive.Title ref={ref} className={cn('text-[24px] leading-8 short:text-[22px] short:leading-7', className)} {...props} />);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => <DialogPrimitive.Description ref={ref} className={cn('text-[16px] leading-6', className)} {...props} />);
DialogDescription.displayName = 'DialogDescription';

export { Dialog, DialogClose, DialogContent, DialogTitle, DialogDescription };
