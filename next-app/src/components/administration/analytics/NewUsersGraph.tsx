"use client";

import { LineChart } from "@/components/Charts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const NewUsersGraph = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Users</CardTitle>
        <CardDescription>
          The number of new users joining the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LineChart className="aspect-[9/4]" />
      </CardContent>
    </Card>
  );
};

export default NewUsersGraph;
