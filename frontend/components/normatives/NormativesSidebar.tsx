import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "../ui/sidebar";
import { Compulsoriness, Criterion, CycleStageEnum } from "@/types/Criterion";
import CompulAccordion from "./CompulAccordion";
import CriterionAccordion from "./CriterionAccordion";

const NormativesSidebar = () => {
  const items: {
    Compulsoriness: Compulsoriness[];
    Criterions: Criterion[];
  } = {
    Compulsoriness: [
      {
        id: "1",
        term: "Must",
      },
      {
        id: "2",
        term: "Should",
      },
    ],
    Criterions: [
      {
        controlId: "1",
        title: "Is it accessible?",
        description: "This is the description",
        cycleStage: CycleStageEnum.P,
        compulsoriness: [
          {
            id: "1",
            term: "Must",
          },
        ],
      },
      {
        controlId: "2",
        title: "Is it true",
        description: "This is the description",
        cycleStage: CycleStageEnum.D,
        compulsoriness: [
          {
            id: "1",
            term: "Must",
          },
        ],
      },
    ],
  };

  return (
    <div>
      <Sidebar>
        <SidebarContent className="mt-16">
          {Object.keys(items).map((key) => (
            <SidebarGroup key={key}>
              <SidebarGroupLabel className="text-xl  text-black">
                {key}
              </SidebarGroupLabel>
              <hr className=" h-0.5 border-t-0 bg-neutral-300 dark:bg-white/10" />

              <SidebarGroupContent>
                <SidebarMenu>
                  {key === "Compulsoriness"
                    ? items["Compulsoriness"].map((compulsoriness, index) => (
                        <CompulAccordion
                          key={index}
                          compulsoriness={compulsoriness}
                        />
                      ))
                    : items["Criterions"].map((criterion) => (
                        <CriterionAccordion
                          key={criterion.controlId}
                          criterion={criterion}
                        />
                      ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default NormativesSidebar;
