// components/form/FormField.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";

type Props = {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  disabled?: boolean;
};

export default function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  disabled = false,
}: Props) {
  return (
    <div>
      <Label htmlFor={name} className="font-semibold">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
