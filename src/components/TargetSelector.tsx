
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TargetSelectorProps {
  onSelectTarget: (target: number) => void;
}

const TargetSelector: React.FC<TargetSelectorProps> = ({ onSelectTarget }) => {
  const [customTarget, setCustomTarget] = React.useState<string>("");

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setCustomTarget(value);
    }
  };

  const handleCustomSubmit = () => {
    const target = parseInt(customTarget, 10);
    if (!isNaN(target) && target > 0) {
      onSelectTarget(target);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-2xl font-medium text-orange-500">Select Target Count</h2>
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          className="bg-white text-orange-500 border-2 border-orange-400 hover:bg-orange-50 hover:border-orange-500 w-28 h-12 text-lg font-medium"
          variant="outline" 
          onClick={() => onSelectTarget(108)}
        >
          108
        </Button>
        <Button 
          className="bg-white text-orange-500 border-2 border-orange-400 hover:bg-orange-50 hover:border-orange-500 w-28 h-12 text-lg font-medium"
          variant="outline" 
          onClick={() => onSelectTarget(1008)}
        >
          1008
        </Button>
        <div className="flex items-center gap-2">
          <Input
            className="border-2 border-orange-400 h-12 text-lg font-medium w-28 text-center"
            placeholder="Custom"
            value={customTarget}
            onChange={handleCustomChange}
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <Button 
            className="bg-white text-orange-500 border-2 border-orange-400 hover:bg-orange-50 hover:border-orange-500 h-12 text-lg font-medium"
            variant="outline" 
            onClick={handleCustomSubmit}
          >
            Set
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TargetSelector;
