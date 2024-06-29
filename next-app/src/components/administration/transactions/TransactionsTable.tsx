import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Transaction } from "@/types/hookResponse.type";

type TransactionsTableProps = {
  transactions: Transaction[];
};

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  return (
    <div>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">From</TableHead>
              <TableHead className="hidden md:table-cell">To</TableHead>
              <TableHead className="hidden md:table-cell">Amount</TableHead>
              <TableHead className="hidden md:table-cell">Hash</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions &&
              transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                />
              ))}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

function TransactionRow({ transaction }: { transaction: Transaction }) {
  const date = new Date(transaction.created_at).toLocaleString("fr");

  return (
    <TableRow>
      <TableCell className="font-medium">{transaction.from}</TableCell>
      <TableCell className="hidden md:table-cell">{transaction.to}</TableCell>
      <TableCell className="hidden md:table-cell">
        {transaction.amount}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {transaction.transaction}
      </TableCell>
      <TableCell className="hidden md:table-cell">{date}</TableCell>
    </TableRow>
  );
}

export default TransactionsTable;
