import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Searchbar = () => {
  return (
    <div className="relative flex-1 max-w-md mx-4">
      <Input
        type="text"
        placeholder="Search galleries..."
        className="w-full px-3 py-2 border rounded-md shadow-sm focus:ring-0 focus:outline-none focus:border-transparent focus-visible:ring-0 focus-visible:outline-none pr-10"
      />
      <Search
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        size={20}
      />
    </div>
  );
};

export default Searchbar;
