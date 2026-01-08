import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type NotFoundCardProps = {
  title: string;
  description: string;
  backHref?: string;
  backLabel: string;
  containerClassName?: string;
};

export function NotFoundCard({
  title,
  description,
  backHref = "/",
  backLabel,
  containerClassName = "flex min-h-screen items-center justify-center",
}: NotFoundCardProps) {
  return (
    <div className={containerClassName}>
      <Card className="mx-4 w-full max-w-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href={backHref}>
              <ArrowLeft className="mr-2 size-4" />
              {backLabel}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
