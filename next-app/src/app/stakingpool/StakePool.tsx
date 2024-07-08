import { Card, CardTitle, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableFooter,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table"
  
 const invoices = [
   {
     invoice: "INV001",
     paymentStatus: "Paid",
     totalAmount: "$250.00",
     paymentMethod: "Credit Card",
   },
   {
     invoice: "INV002",
     paymentStatus: "Pending",
     totalAmount: "$150.00",
     paymentMethod: "PayPal",
   },
   {
     invoice: "INV003",
     paymentStatus: "Unpaid",
     totalAmount: "$350.00",
     paymentMethod: "Bank Transfer",
   },
   {
     invoice: "INV004",
     paymentStatus: "Paid",
     totalAmount: "$450.00",
     paymentMethod: "Credit Card",
   },
   {
     invoice: "INV005",
     paymentStatus: "Paid",
     totalAmount: "$550.00",
     paymentMethod: "PayPal",
   },
   {
     invoice: "INV006",
     paymentStatus: "Pending",
     totalAmount: "$200.00",
     paymentMethod: "Bank Transfer",
   },
   {
     invoice: "INV007",
     paymentStatus: "Unpaid",
     totalAmount: "$300.00",
     paymentMethod: "Credit Card",
   },
 ]

export default function StakingPoolCard() {
   return (
      <Table className="w-full">
      <TableCaption>A list of all staking pools</TableCaption>
      <TableHeader>
         <TableRow>
            <TableHead className="w-[150px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
         </TableRow>
      </TableHeader>
      <TableBody>
         {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
            <TableCell className="font-medium">{invoice.invoice}</TableCell>
            <TableCell>{invoice.paymentStatus}</TableCell>
            <TableCell>{invoice.paymentMethod}</TableCell>
            <TableCell className="text-right">{invoice.totalAmount}</TableCell>
            </TableRow>
         ))}
      </TableBody>
      </Table>
   )
}

// Remplace cette fonction par ta fonction de récupération de données
const getItems = async () => {
  return [
    { name: 'Item 1', description: 'Description for item 1' },
    { name: 'Item 2', description: 'Description for item 2' },
  ];
};