import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatAddress } from "@/utils/string.util";
import React, { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/types/user.type";

type UsersTableProps = {
  users: User[];
  isLoading: boolean;
};

const UsersTable: React.FC<UsersTableProps> = ({ users, isLoading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const currentUsers = users.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card x-chunk="dashboard-06-chunk-0" className="bg-transparant">
      <CardHeader>
        <CardTitle>Users</CardTitle>
        <CardDescription>
          List of all users registered on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Banned</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              : currentUsers.map((user) => (
                  <UserRow key={user.id} user={user} />
                ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center w-full">
          <div className="text-xs text-muted-foreground">
            Showing{" "}
            <strong>
              {currentPage * rowsPerPage - rowsPerPage + 1}-
              {Math.min(currentPage * rowsPerPage, users.length)}
            </strong>{" "}
            of <strong>{users.length}</strong> users
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => handleChangePage(currentPage - 1)}
              disabled={currentPage === 1}
              variant="outline"
            >
              Previous
            </Button>
            <Button
              onClick={() => handleChangePage(currentPage + 1)}
              disabled={currentPage * rowsPerPage >= users.length}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

function UserRow({ user }: { user: User }) {
  const updatedDate = new Date(user.updated_at).toLocaleString("fr");
  const createdDate = new Date(user.created_at).toLocaleString("fr");

  return (
    <TableRow>
      <TableCell>{user.id}</TableCell>
      <TableCell>{createdDate}</TableCell>
      <TableCell>{updatedDate}</TableCell>
      <TableCell>{user.name}</TableCell>
      <TableCell>{formatAddress(user.address)}</TableCell>
      <TableCell>{user.banned}</TableCell>
    </TableRow>
  );
}

export default UsersTable;
