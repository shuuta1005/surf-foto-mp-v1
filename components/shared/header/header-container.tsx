// components/shared/header/header-container.tsx
import { auth } from "@/auth";
import HeaderWrapper from "./HeaderWrapper";

const HeaderContainer = async () => {
  const session = await auth(); // ✅ cleaner
  return <HeaderWrapper session={session} />;
};

export default HeaderContainer;
