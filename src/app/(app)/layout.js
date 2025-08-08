import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AgniGenix-TaskManager",
  description: "Manage your tasks efficiently",
};

export default function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}
