import Navbar from "@/components/mols/menubars";

//
export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen w-full max-w-[1400px] flex-col bg-muted/10">
      <div className="flex flex-col sm:gap-4">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
