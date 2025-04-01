export default function AuthLayout({
  children,
}: Readonly<{
  //This thing prevents unexpected side effects (a layout component accidentally changing page content).
  children: React.ReactNode;
}>) {
  return <div className="flex-center min-h-screen w-full">{children}</div>;
}
