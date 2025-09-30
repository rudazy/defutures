import { Inter } from "next/font/google";
import "./globals.css";
import { Web3Provider } from "@/context/Web3Context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DeFutures - Trade Your Insights",
  description: "Decentralized prediction markets live on Fluent Testnet. Empowering collective intelligence on the blockchain.",
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