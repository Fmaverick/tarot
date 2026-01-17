import { CustomModeView } from "@/components/tarot/agent/CustomModeView";

export default function CustomModePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50 p-4 lg:p-8">
      <div className="w-full max-w-4xl h-[85vh]">
        <CustomModeView />
      </div>
    </div>
  );
}
