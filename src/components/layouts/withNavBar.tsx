import Navbar from "../mols/menubars";

export default function WithNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
