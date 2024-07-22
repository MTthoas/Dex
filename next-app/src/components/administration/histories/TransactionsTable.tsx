import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTransaction } from "@/hook/transactions.hook";
import { Transaction } from "@/types/transaction.type";
import { formatAddress } from "@/utils/string.util";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { MoreHorizontal } from "lucide-react";
import { toast } from "sonner";

type TransactionsTableProps = {
  transactions: Transaction[];
  isLoading: boolean;
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const currentTransactions = transactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <Card x-chunk="dashboard-06-chunk-0" className="bg-transparant">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>
          Manage all your transactions here. You can view, edit, and delete
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>From → To</TableHead>
              <TableHead>Amount A</TableHead>
              <TableHead>Amount B</TableHead>
              <TableHead className="hidden md:table-cell">Symbol A</TableHead>
              <TableHead className="hidden md:table-cell">Symbol B</TableHead>
              <TableHead className="hidden md:table-cell">Update</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
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
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                  </TableRow>
                ))
              : currentTransactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                  />
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
              {Math.min(currentPage * rowsPerPage, transactions.length)}
            </strong>{" "}
            of <strong>{transactions.length}</strong> transactions
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
              disabled={currentPage * rowsPerPage >= transactions.length}
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

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const date = new Date(transaction.updated_at).toLocaleString("fr");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.info(`Transaction ${transaction.id} deleted`);
    },
  });

  const typeToVariant = (type: string) => {
    switch (type) {
      case "send":
        return "secondary";
      case "swap":
        return "outline";
      case "stack":
        return "warning";
      default:
        return "default";
    }
  };

  const handleDelete = (id: number) => {
    mutation.mutate(transaction.id);
  };

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`Hash copied: ${text}`);
      },
      (err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy hash");
      }
    );
  }

  return (
    <TableRow>
      <TableCell>{transaction.id}</TableCell>
      <TableCell>
        <Badge variant={typeToVariant(transaction.type)}>
          {transaction.type}
        </Badge>
      </TableCell>
      <TableCell>
        {formatAddress(transaction.from)} → {formatAddress(transaction.to)}
      </TableCell>
      <TableCell>{transaction.amount_a.toFixed(2)}</TableCell>
      <TableCell>{transaction.amount_b.toFixed(2)}</TableCell>
      <TableCell className="hidden md:table-cell">
        {transaction.symbol_a}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {transaction.symbol_b}
      </TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => copyToClipboard(transaction.hash)}
              className="mt-1"
            >
              Copy hash <ClipboardIcon className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(transaction.id)}>
              Delete <TrashIcon className="ml-2 h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

export default TransactionsTable;

export function ClipboardIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  );
}

export function TrashIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M16 6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
