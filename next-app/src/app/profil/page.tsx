"use client";
import { useAccount } from "wagmi";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CreateUserRequest } from "@/hook";
import { useEffect } from "react";
import Link from "next/link";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { createUser, getUserByAdress } from "@/hook/users.hook";
import { User } from "@/types/user.type";
import { Textarea } from "@/components/ui/textarea";

export default function Profil() {
  const { address, isConnected } = useAccount();

  const {
    data: user,
    error,
    isError,
  } = useQuery<User>({
    queryKey: ["getUserByAddress", address],
    queryFn: () => getUserByAdress(address!),
    enabled: !!address,
  });


  const mutation = useMutation<
    ReturnType<typeof createUser>,
    Error,
    CreateUserRequest
  >({ mutationFn: createUser });

  useEffect(() => {
    // Déclencher la mutation si une erreur survient et aucune donnée n'est retournée
    if (!user && address && isError) {
      mutation.mutate({ address, name: "New User" });
    }
  }, [address, isError, user]);

  return (
    <main className="flex min-h-[calc(90vh_-_theme(spacing.16))] flex-1 flex-col gap-4 md:gap-8 pt-10 mb-12">
      <div className="mx-auto grid w-full max-w-7xl gap-2 px-7 pb-3 ">
        <h1 className="text-3xl font-semibold">Settings</h1>
        <p className="border-b border-white pb-5">
          {" "}
          Manage your account settings and set e-mail preferences.{" "}
        </p>
      </div>
      <div className="mx-auto grid w-full px-7 max-w-7xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          <Link href="#" className="font-semibold text-xl text-primary">
            Profile
          </Link>
          <Link href="#">Account</Link>
          <Link href="#">Notifications</Link>
        </nav>
        <div className="grid gap-6 mt-1">
          <Card x-chunk="dashboard-04-chunk-1" className="border-0">
            <CardTitle>Profile</CardTitle>
            <p className="py-3 border-b">
              {" "}
              This is how others will see you on the site{" "}
            </p>
          </Card>
          <Card x-chunk="dashboard-04-chunk-2" className="border-0">
            <h1 className="mb-2 font-bold">Username</h1>
            <p className="text-sm pb-2">
              {" "}
              This is your public display name. It can be your real name or a
              pseudonym. You can only change this once every 30 days.
            </p>
            <Input />

            <h1 className="mb-2 font-bold mt-5">Address</h1>
            <p className="text-sm pb-2"> This is your public address.</p>
            <Input disabled value={address} />

            <h1 className="mb-2 mt-5 font-bold">Bio</h1>
            <Input placeholder="Type your message here." />
          </Card>

          <Card x-chunk="dashboard-04-chunk-1" className="border-0 mt-5">
            <h1 className="font-bold">URL's</h1>
            <p className="py-2">
              {" "}
              Add your social media profiles to share with others{" "}
            </p>
            <Input className="my-2" />
            <Input className="my-2" />

            <Button size="lg" className="mt-5">
              Update profile
            </Button>
          </Card>
        </div>
      </div>
    </main>
  );
}
