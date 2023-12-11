import React from 'react';

export default function Layout({ children }: React.PropsWithChildren) {
  return <div className="p-3 md:p-4 lg:p-6">{children}</div>;
}
