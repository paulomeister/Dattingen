import NormativesSidebar from "@/components/normatives/NormativesSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
const CreateLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex items-center justify-center">
      <SidebarProvider>
        <NormativesSidebar />
        <SidebarTrigger className="hover:cursor-pointer" />
        <div className="flex items-center justify-center">{children}</div>
      </SidebarProvider>
    </div>
  );
};

export default CreateLayout;
