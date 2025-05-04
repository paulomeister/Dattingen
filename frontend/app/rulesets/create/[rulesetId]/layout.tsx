import NormativesSidebar from "@/components/normatives/NormativesSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Esta es una función que se ejecuta en el servidor para obtener los params
// La usamos para acceder al rulesetId en un layout de Next.js App Router
interface CreateLayoutProps {
  children: React.ReactNode;
  params: {
    rulesetId: string;
  };
}

const CreateLayout = ({ children, params }: Readonly<CreateLayoutProps>) => {
  const { rulesetId } = params;
  
  return (
    <div className="flex items-center justify-center">
      <SidebarProvider>
        {/* Pasando `rulesetId` a NormativesSidebar como prop */}
        <NormativesSidebar rulesetId={rulesetId} />
        <SidebarTrigger className="hover:cursor-pointer" />
        <div className="mx-auto my-auto w-full">
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CreateLayout;
