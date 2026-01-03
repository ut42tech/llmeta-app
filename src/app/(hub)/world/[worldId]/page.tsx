"use client";

import { ArrowLeft, Globe, Plus, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import { InstanceCard } from "@/components/InstanceCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInstancesByWorldId, getWorldById } from "@/constants/worlds";
import { useLocalPlayerStore } from "@/stores/localPlayerStore";

export default function WorldDetailPage() {
  const params = useParams<{ worldId: string }>();
  const router = useRouter();
  const t = useTranslations("world");
  const format = useFormatter();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const setRoomName = useLocalPlayerStore((state) => state.setRoomName);

  const world = getWorldById(params.worldId);
  const instances = getInstancesByWorldId(params.worldId);

  if (!world) {
    notFound();
  }

  const handleCreateInstance = () => {
    const roomName = newRoomName.trim() || `room-${Date.now()}`;
    setRoomName(roomName);
    setIsCreateDialogOpen(false);
    router.push(`/instance/${roomName}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-64 md:h-80 bg-muted overflow-hidden">
        <Image
          src={world.thumbnail}
          alt={world.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />

        <div className="absolute top-4 left-4">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="bg-background/50 backdrop-blur"
            >
              <ArrowLeft className="size-4 mr-2" />
              {t("back")}
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold">{world.name}</h1>
            <p className="text-muted-foreground mt-2">{world.description}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 lg:p-8 max-w-4xl">
        {/* World Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="size-5" />
              {t("worldInfo")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("capacity")}</p>
                <p className="font-medium flex items-center gap-1">
                  <Users className="size-4" />
                  {world.playerCapacity} {t("players")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("createdAt")}</p>
                <p className="font-medium">
                  {format.dateTime(new Date(world.createdAt), {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instances Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">{t("instances")}</h2>
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="size-4 mr-2" />
                  {t("createInstance")}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("createInstanceTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("createInstanceDescription")}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName">{t("roomName")}</Label>
                    <Input
                      id="roomName"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder={t("roomNamePlaceholder")}
                      maxLength={50}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleCreateInstance}>{t("create")}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {instances.length > 0 ? (
            <div className="space-y-3">
              {instances.map((instance) => (
                <InstanceCard key={instance.id} instance={instance} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <CardDescription>{t("noInstances")}</CardDescription>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
