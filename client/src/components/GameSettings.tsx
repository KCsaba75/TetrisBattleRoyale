import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface GameSettingsProps {
  volume: number;
  soundEnabled: boolean;
  difficulty: string;
  onVolumeChange: (value: number) => void;
  onSoundToggle: (enabled: boolean) => void;
  onDifficultyChange: (difficulty: string) => void;
}

const GameSettings = ({
  volume,
  soundEnabled,
  difficulty,
  onVolumeChange,
  onSoundToggle,
  onDifficultyChange
}: GameSettingsProps) => {
  return (
    <Card className="bg-black/50 backdrop-blur-sm border-cyan-500/30">
      <CardContent className="p-4">
        <h2 className="text-lg font-['Orbitron'] text-cyan-400 mb-4">SETTINGS</h2>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="volume" className="block text-gray-400 mb-2">Volume</Label>
            <Slider 
              id="volume" 
              min={0} 
              max={100} 
              step={1}
              value={[volume]}
              onValueChange={(vals) => onVolumeChange(vals[0])}
              className="w-full"
            />
          </div>
          
          <div className="flex items-center">
            <Switch 
              id="mute-sounds" 
              checked={soundEnabled}
              onCheckedChange={onSoundToggle}
              className="mr-2"
            />
            <Label htmlFor="mute-sounds" className="text-white">Sound Effects</Label>
          </div>
          
          <div>
            <Label htmlFor="difficulty" className="block text-gray-400 mb-2">Difficulty</Label>
            <Select 
              value={difficulty} 
              onValueChange={onDifficultyChange}
            >
              <SelectTrigger className="w-full bg-black/50 border-cyan-500/50">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-cyan-500/50">
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSettings;
