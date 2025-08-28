import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Providers from "@/lib/Provider";
import UserContextProvider from "@/context/userContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AuthContextProvider, { AuthContext } from "@/context/AuthContext";
import { WorkspaceContextProvider } from "@/context/WorkspaceContext";
import { ProjectContextProvider } from "@/context/ProjectContext";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.className} dark:bg-[#151c26] transition-all duration-300 dark:text-white`}
        // suppressHydrationWarning
      >
        <ThemeProvider>
          <Providers>
            <AuthContextProvider>
              <WorkspaceContextProvider>
                <ProjectContextProvider>
                  <Navbar />
                  {children}
                </ProjectContextProvider>
              </WorkspaceContextProvider>
            </AuthContextProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
