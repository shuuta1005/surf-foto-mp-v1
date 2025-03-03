//✅ This layout applies to EVERY page.
//✅ The {children} part is where the page's content is inserted.

import Footer from "@/components/shared/footer";
import Header from "@/components/shared/header";

export default function RootLayout({
  children,
}: Readonly<{
  //This thing prevents unexpected side effects (a layout component accidentally changing page content).
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  );
}
