// components/shared/header/header-container.tsx
import { auth } from "@/auth";
import Header from "./index";

const HeaderContainer = async () => {
  const session = await auth(); // ✅ cleaner
  return <Header session={session} />;
};

export default HeaderContainer;
