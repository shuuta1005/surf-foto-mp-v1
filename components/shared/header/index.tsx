// components/shared/header/index.tsx

import UserButton from "./user-button-client";
import { Session } from "next-auth";
import SideMenu from "./SideMenu";
import Logo from "./logo";
import Searchbar from "./searchBar";
import AreaFilterBar from "@/components/shared/filters/AreaFilterBar";
import CartButton from "./CartButton";

interface HeaderProps {
  session: Session | null;
  areas: string[];
}

const Header = ({ session, areas }: HeaderProps) => {
  return (
    <header className="w-full bg-stone-100 shadow-md sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-4 border-b">
        {/* Left: Side menu */}
        <div className="flex items-center gap-2">
          <SideMenu />
        </div>

        {/* Center: Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>

        {/* Right: Search + User */}
        <div className="flex items-center gap-4">
          <Searchbar />
          <UserButton session={session} />
          <CartButton />
        </div>
      </div>

      <AreaFilterBar areas={areas} />
    </header>
  );
};

export default Header;
