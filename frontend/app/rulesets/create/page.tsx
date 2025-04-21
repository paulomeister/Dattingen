import RulesetCreator from "@/components/normatives/RulesetCreator";


const CreateNormativeItemPage = () => {
  return (
    <div className="flex flex-col items-center justify-center border-1 border-slate-300 px-5 md:mt-[-30px]">
      {/* Delegamos toda la interactividad al componente cliente */}
      <RulesetCreator />
    </div>
  );
};

export default CreateNormativeItemPage;
