"use client";
import React, { useRef } from "react";
import NormativesSidebar, { NormativesSidebarRef } from "@/components/normatives/NormativesSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface ClientLayoutProps {
  children: React.ReactNode;
  rulesetId: string;
}

const ClientLayout = ({ children, rulesetId }: ClientLayoutProps) => {
  const sidebarRef = useRef<NormativesSidebarRef>(null);

  const handleRulesetUpdate = () => {
    if (sidebarRef.current) {
      sidebarRef.current.refreshSidebar();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <SidebarProvider>
        <NormativesSidebar ref={sidebarRef} rulesetId={rulesetId} />
        <SidebarTrigger className="hover:cursor-pointer" />
        <div className="mx-auto my-auto w-full">
          {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
              return React.cloneElement(child as any, {
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

export default ClientLayout;