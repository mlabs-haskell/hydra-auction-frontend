import React from 'react';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <div className="m-6 md:m-12 lg:m-24 w-screen h-screen">{children}</div>
  );
}
