// components/shared/header/header-container.tsx
import { getServerSession } from "next-auth";
import { config } from "@/auth";
import Header from "./index";

const HeaderContainer = async () => {
  const session = await getServerSession(config);
  return <Header session={session} />;
};

export default HeaderContainer;
