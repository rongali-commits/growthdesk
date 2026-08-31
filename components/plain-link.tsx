import type { ComponentProps } from 'react';

export function Link({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>;
}
