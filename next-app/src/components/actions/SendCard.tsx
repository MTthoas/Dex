"use client";
import { useState } from "react";
import { Input } from "../ui/input";

const SendCryptoCard = () => {
  const [amount, setAmount] = useState<String>("0");
  const [price, setPrice] = useState<String>("0.0000");

  const handleInputChange = (value: string) => {
    setAmount(value);
    console.log(value);
    if (value === "0" || value === "") {
      setPrice("0.00");
      return;
    }
    // Simuler un taux de conversion ETH en USD (fictif)
    const price = parseFloat(value) * 3500;
    setPrice(price.toFixed(4));

    console.log(amount);
  };

  return (
    <div className="mt-2">
      <Input
        type="string"
        className=" "
        placeholder="Enter amount in USD"
        value={String(amount)}
        onChange={(e) => handleInputChange(e.target.value)}
      />
      <h2 className="text-lg mt-4">{"You're sending"}</h2>
      <div className="relative text-4xl font-bold">${price || 0}</div>
    </div>
  );
};

export default SendCryptoCard;
