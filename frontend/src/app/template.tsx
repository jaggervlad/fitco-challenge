import ClientLayout from "../components/layout/ClientLayout";

export default function Template({ children }: { children: React.ReactNode }) {
  return <ClientLayout>{children}</ClientLayout>;
}
