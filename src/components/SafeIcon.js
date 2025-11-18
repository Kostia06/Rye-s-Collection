'use client';

export default function SafeIcon({ children }) {
  return <div suppressHydrationWarning>{children}</div>;
}
