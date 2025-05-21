import ClientLayout from "./ClientLayout";

export default function Layout({ children, params }: { children: React.ReactNode; params: { rulesetId: string } }) {
  return <ClientLayout rulesetId={params.rulesetId}>{children}</ClientLayout>;
}