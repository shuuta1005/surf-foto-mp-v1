//✅ This layout applies to EVERY page.
//✅ The {children} part is where the page's content is inserted.

// app/(root)/layout.tsx
import Footer from "@/components/shared/footer";
import HeaderContainer from "@/components/shared/header/header-container";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderContainer /> {/* ✅ pass it down */}
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
