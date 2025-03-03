import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryPaginationProps {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
}

const GalleryPagination: React.FC<GalleryPaginationProps> = ({
  currentPage,
  totalPages,
  onNext,
  onPrev,
}) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm text-gray-600">
        Page {currentPage + 1} of {totalPages}
      </p>
      <button
        onClick={onPrev}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === 0}
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onNext}
        className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50"
        disabled={currentPage === totalPages - 1}
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default GalleryPagination;
