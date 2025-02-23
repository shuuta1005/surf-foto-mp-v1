"use client";

import SideMenu from "./SideMenu";
import Logo from "./logo";
import Searchbar from "./searchBar";
import FilterDropdown from "./FilterDropdown";

const Header = () => {
  return (
    <header className="w-full border-b bg-stone-100 shadow-md">
      <div className="wrapper flex items-center p-4 gap-4 max-w-7xl mx-auto">
        {/* Side Menu */}
        <SideMenu />

        {/* Logo */}
        <Logo />

        {/* Search Bar */}
        <Searchbar />

        {/* Filter Button */}
        <FilterDropdown />
      </div>
    </header>
  );
};

export default Header;
