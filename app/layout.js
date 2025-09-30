import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Fluent Prediction Market",
  description: "Decentralized prediction market on Fluent Testnet",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}