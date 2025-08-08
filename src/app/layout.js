import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/lib/Provider";
import UserContextProvider from "@/context/userContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "AgniGenix-TaskManager",
  description: "Manage your tasks efficiently",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} dark:bg-[#151c26] transition-all duration-1000 dark:text-white`}
      >
        <Providers>
          <UserContextProvider
            value={{ user: null, isUserLoggedIn: false, isLoading: true }}
          >
            {children}
          </UserContextProvider>
        </Providers>
      </body>
    </html>
  );
}
