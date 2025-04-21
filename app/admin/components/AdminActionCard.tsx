// app/admin/components/AdminActionCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";

interface AdminActionCardProps {
  title: string;
  description: string;
  emoji?: string;
  href: string;
}

const AdminActionCard: React.FC<AdminActionCardProps> = ({
  title,
  description,
  emoji,
  href,
}) => {
  const router = useRouter();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition"
      onClick={() => router.push(href)}
    >
      <CardHeader>
        <CardTitle>
          {emoji && <span className="mr-2">{emoji}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
    </Card>
  );
};

export default AdminActionCard;
