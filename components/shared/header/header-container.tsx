// components/shared/header/header-container.tsx

import { auth } from "@/auth";
import Header from "./index";
import { getFilterOptions } from "@/lib/actions/gallery";

const HeaderContainer = async () => {
  const session = await auth();
  const { areas } = await getFilterOptions();

  return <Header session={session} areas={areas} />;
};

export default HeaderContainer;
