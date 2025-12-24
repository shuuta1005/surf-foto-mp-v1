// components/shared/header/header-container.tsx

import Header from "./index";
import { getFilterOptions } from "@/lib/actions/gallery";

const HeaderContainer = async () => {
  // ✅ Removed auth() call - Header/UserButton will handle it internally
  const { areas } = await getFilterOptions();

  return <Header areas={areas} />; // ✅ No session prop
};

export default HeaderContainer;
