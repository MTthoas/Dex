import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
<<<<<<< HEAD

=======
 
>>>>>>> develop
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
