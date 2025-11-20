// // app/admin/upload/components/UploadPhotoSelector.tsx
// "use client";

// import { Input } from "@/components/ui/input";
// import { Label } from "@radix-ui/react-label";
// import { UploadCloud, XCircle } from "lucide-react";
// import Image from "next/image";

// type Props = {
//   files: FileList | null;
//   setFiles: (files: FileList | null) => void;
//   disabled: boolean;
//   onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
// };

// export default function UploadPhotoSelector({
//   files,
//   setFiles,
//   disabled,
//   onDrop,
// }: Props) {
//   return (
//     <div>
//       <Label htmlFor="photos" className="block mb-2 text-base font-semibold">
//         Surf Photos
//       </Label>
//       <div
//         onDrop={onDrop}
//         onDragOver={(e) => e.preventDefault()}
//         className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition ${
//           disabled ? "opacity-50 cursor-not-allowed" : ""
//         }`}
//       >
//         <UploadCloud className="w-10 h-10 mx-auto text-gray-400" />
//         <p className="mt-2 text-gray-600 font-medium">
//           Drag & Drop photos here
//         </p>
//         <p className="text-sm text-gray-400 mb-4">or</p>
//         <label
//           htmlFor="photos"
//           className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded hover:bg-gray-600 transition cursor-pointer ${
//             disabled ? "pointer-events-none opacity-60" : ""
//           }`}
//         >
//           Browse Files
//         </label>
//         <Input
//           id="photos"
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={(e) => setFiles(e.target.files)}
//           disabled={disabled}
//           className="hidden"
//         />

//         {files && (
//           <div className="mt-4 space-y-2">
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//               {Array.from(files).map((file, idx) => {
//                 const previewUrl = URL.createObjectURL(file);
//                 return (
//                   <div key={idx} className="relative w-full h-40">
//                     <Image
//                       src={previewUrl}
//                       alt={`Preview ${idx}`}
//                       fill
//                       className="object-cover rounded shadow"
//                       onLoadingComplete={() => URL.revokeObjectURL(previewUrl)}
//                     />
//                   </div>
//                 );
//               })}
//             </div>
//             <div className="flex flex-col items-center gap-1">
//               <p className="text-sm text-muted-foreground">
//                 {files.length} file(s) selected
//               </p>
//               <button
//                 type="button"
//                 onClick={() => setFiles(null)}
//                 className="text-xs text-red-500 hover:underline flex items-center gap-1"
//               >
//                 <XCircle className="w-4 h-4" />
//                 Clear All
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { UploadCloud, XCircle } from "lucide-react";
import Image from "next/image";

type Props = {
  files: File[] | null; // switched to File[] for easier manipulation
  setFiles: (files: File[] | null) => void;
  disabled: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
};

export default function UploadPhotoSelector({
  files,
  setFiles,
  disabled,
  onDrop,
}: Props) {
  const handleDelete = (index: number) => {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles.length > 0 ? newFiles : null);
  };

  return (
    <div>
      <Label htmlFor="photos" className="block mb-2 text-base font-semibold">
        Surf Photos
      </Label>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <UploadCloud className="w-10 h-10 mx-auto text-gray-400" />
        <p className="mt-2 text-gray-600 font-medium">
          Drag & Drop photos here
        </p>
        <p className="text-sm text-gray-400 mb-4">or</p>
        <label
          htmlFor="photos"
          className={`inline-block px-4 py-2 text-sm font-bold text-white bg-gray-500 rounded hover:bg-gray-600 transition cursor-pointer ${
            disabled ? "pointer-events-none opacity-60" : ""
          }`}
        >
          Browse Files
        </label>
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setFiles(e.target.files ? Array.from(e.target.files) : null)
          }
          disabled={disabled}
          className="hidden"
        />

        {files && (
          <div className="mt-4 space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {files.map((file, idx) => {
                const previewUrl = URL.createObjectURL(file);
                return (
                  <div key={idx} className="relative w-full h-40 group">
                    <Image
                      src={previewUrl}
                      alt={`Preview ${idx}`}
                      fill
                      className="object-cover rounded shadow"
                      onLoadingComplete={() => URL.revokeObjectURL(previewUrl)}
                    />
                    {/* Delete button overlay */}
                    <button
                      type="button"
                      onClick={() => handleDelete(idx)}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-75 transition"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-muted-foreground">
                {files.length} file(s) selected
              </p>
              <button
                type="button"
                onClick={() => setFiles(null)}
                className="text-xs text-red-500 hover:underline flex items-center gap-1"
              >
                <XCircle className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
