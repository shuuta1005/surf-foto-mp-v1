// components/shared/header/index.tsx

// "use client";

// import UserButton from "./user-button-client";
// import { Session } from "next-auth";
// import SideMenu from "./SideMenu";
// import Logo from "./logo";
// import Searchbar from "./searchBar";
// // import AreaFilterDropdown from "./AreaFilterDropdown";

// interface HeaderProps {
//   session: Session | null;
//   areas: string[]; // ✅ Add this
// }

// const Header = ({ session }: HeaderProps) => {
//   return (
//     <header className="w-full border-b bg-stone-100 shadow-md sticky top-0 z-10">
//       <div className="wrapper flex items-center p-4 gap-4 max-w-7xl mx-auto">
//         {/* Side Menu */}
//         <SideMenu />

//         {/* Logo */}
//         <Logo />

//         {/* Search Bar */}
//         <Searchbar />

//         {/* Filter Button */}
//         {/* <AreaFilterDropdown areas={areas} /> */}

//         {/* User Button */}
//         <UserButton session={session} />
//       </div>
//     </header>
//   );
// };

// export default Header;

import UserButton from "./user-button-client";
import { Session } from "next-auth";
import SideMenu from "./SideMenu";
import Logo from "./logo";
import Searchbar from "./searchBar";
import AreaFilterBar from "@/components/shared/filters/AreaFilterBar";

interface HeaderProps {
  session: Session | null;
  areas: string[]; // ✅ dynamic areas passed down
}

const Header = ({ session, areas }: HeaderProps) => {
  return (
    <header className="w-full bg-stone-100 shadow-md sticky top-0 z-40">
      {/* Top Row: Logo, Search, User */}
      <div className="wrapper flex items-center p-4 gap-4 max-w-7xl mx-auto border-b">
        <SideMenu />
        <Logo />
        <Searchbar />
        <UserButton session={session} />
      </div>

      {/* Area Filter Bar directly under header row */}
      <AreaFilterBar areas={areas} />
    </header>
  );
};

export default Header;
