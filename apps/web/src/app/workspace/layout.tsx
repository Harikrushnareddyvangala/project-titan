export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="
      min-h-screen
      bg-gradient-to-br
      from-zinc-950
      via-black
      to-zinc-900
      text-white
      "
    >
      {children}
    </main>
  );
}