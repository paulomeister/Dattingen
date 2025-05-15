"use client";
import React, { use, useRef } from "react";
import NormativesSidebar, { NormativesSidebarRef } from "@/components/normatives/NormativesSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

// Esta es una función que se ejecuta en el lado del cliente con hooks de React
interface CreateLayoutProps {
  children: React.ReactNode;
  params: {
    rulesetId: string;
  };
}

const CreateLayout = ({ children, params }: Readonly<CreateLayoutProps>) => {
  const { rulesetId } = use(params); // 🔥 el truco está aquí
  // Creamos una referencia al componente NormativesSidebar
  const sidebarRef = useRef<NormativesSidebarRef>(null);

  // Función para refrescar el sidebar cuando se actualiza el ruleset
  const handleRulesetUpdate = () => {
    // Usamos la función expuesta a través del ref
    if (sidebarRef.current) {
      sidebarRef.current.refreshSidebar();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <SidebarProvider>
        {/* Pasando la referencia al sidebar para poder llamar a sus métodos */}
        <NormativesSidebar ref={sidebarRef} rulesetId={rulesetId} />
        <SidebarTrigger className="hover:cursor-pointer" />
        <div className="mx-auto my-auto w-full">
          {/* Inyectamos la prop onUpdateSuccess en los hijos */}
          {React.Children.map(children, child => {
            // Verificar que child sea un elemento React válido
            if (React.isValidElement(child)) {
              // Clonar el elemento para añadir la prop onUpdateSuccess
              return React.cloneElement(child, {
                onUpdateSuccess: handleRulesetUpdate
              });
            }
            return child;
          })}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CreateLayout;
