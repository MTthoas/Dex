import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { User } from "@/types/hookResponse.type";

type UsersTableProps = {
  users: User[];
};

const UsersTable: React.FC<UsersTableProps> = ({ users }) => {
  return (
    <div>
      <form className="border shadow-sm rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="max-w-[150px]">Name</TableHead>
              <TableHead className="hidden md:table-cell">Address</TableHead>
              <TableHead className="hidden md:table-cell">Username</TableHead>
              <TableHead className="hidden md:table-cell">Created-at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.map((user) => <UserRow key={user.id} user={user} />)}
          </TableBody>
        </Table>
      </form>
    </div>
  );
};

function UserRow({ user }: { user: User }) {
  const userId = user.id;
  // Created_at doit retourner la date + l'heure de la création en format fr
  const created_at = new Date(user.created_at).toLocaleString("fr");

  return (
    <TableRow>
      <TableCell className="font-medium">{userId}</TableCell>
      <TableCell className="font-medium">{user.name}</TableCell>
      <TableCell className="hidden md:table-cell">{user.address}</TableCell>
      <TableCell className="hidden md:table-cell">{created_at}</TableCell>
    </TableRow>
  );
}

export default UsersTable;
