'use client';

import { cn } from '@/utils/cn';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      className={cn(
        'select-none text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50',
        className,
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };
