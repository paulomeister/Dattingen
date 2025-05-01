import NormativesSidebar from "@/components/normatives/NormativesSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
const CreateLayout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="flex items-center justify-center">
      <SidebarProvider>
        {/* Este componente: */}
        <NormativesSidebar />
        <SidebarTrigger className="hover:cursor-pointer" />
        <div className="mx-auto my-auto w-full">
          {children}

        </div>
      </SidebarProvider>
    </div>
  );
};

export default CreateLayout;
