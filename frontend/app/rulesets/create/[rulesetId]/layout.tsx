import ClientLayout from "./ClientLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ rulesetId: string }>
}) {
  const { rulesetId } = await params;
  return <ClientLayout rulesetId={rulesetId}>{children}</ClientLayout>;
} 