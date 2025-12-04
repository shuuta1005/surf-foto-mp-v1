//components/header/HeaderWrapper.tsx
import { getFilterOptions } from "@/lib/actions/gallery";
import Header from "./index"; // Your main Header
import { Session } from "next-auth";

interface HeaderWrapperProps {
  session: Session | null;
}

export default async function HeaderWrapper({ session }: HeaderWrapperProps) {
  const { areas } = await getFilterOptions(); // ✅ Fetch areas here (server-side)

  return <Header session={session} areas={areas} />; // ✅ Pass it to client Header
}
