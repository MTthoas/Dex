interface TransactionCardProps {
  transaction: {
    index: number;
    amount: number;
    label: string;
    price: number;
    timestamp: Date;
  };
}

export const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("default", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="flex flex-col bg-[#1e1f23] py-3 rounded-lg shadow-md">
      <div className="flex justify-between">
        <div className="text-xl">
          {transaction.amount.toFixed(3)} {transaction.label}
        </div>
        <div className={`text-sm pr-4`}>$ {transaction.price.toFixed(3)}</div>
      </div>
      <div className="text-right text-xs text-[#627eea] pr-4">
        {formatDate(transaction.timestamp)}
      </div>
    </div>
  );
};
