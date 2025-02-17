import { cn } from 'fumadocs-ui/components/api';
import { LucideIcon, TerminalIcon } from 'lucide-react';

export const create = ({
  icon: Icon,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: LucideIcon;
}): React.ReactElement => {
  return (
    <div
      className={cn(
        'from-muted to-secondary [a[data-active=true]_&]:from-primary/60 [a[data-active=true]_&]:to-primary [a[data-active=true]_&]:text-primary-foreground rounded-md border bg-gradient-to-b p-0.5 shadow-md',
        className,
      )}
      {...props}
    >
      {Icon ? <Icon /> : <TerminalIcon />}
    </div>
  );
};
