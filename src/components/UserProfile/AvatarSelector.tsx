
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type AvatarOption = {
  id: string;
  url: string;
  alt: string;
};

const maleAvatars: AvatarOption[] = [
  { id: "m1", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9", alt: "Male Avatar 1" },
  { id: "m2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Teddy&backgroundColor=b6e3f4,c0aede,d1d4f9", alt: "Male Avatar 2" },
  { id: "m3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max&backgroundColor=b6e3f4,c0aede,d1d4f9", alt: "Male Avatar 3" },
  { id: "m4", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver&backgroundColor=b6e3f4,c0aede,d1d4f9", alt: "Male Avatar 4" },
  { id: "m5", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=b6e3f4,c0aede,d1d4f9", alt: "Male Avatar 5" },
  { id: "m6", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo&backgroundColor=b6e3f4,c0aede,d1d4f9", alt: "Male Avatar 6" },
];

const femaleAvatars: AvatarOption[] = [
  { id: "f1", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie&backgroundColor=ffdfbf,ffd5dc,ffcbe4", alt: "Female Avatar 1" },
  { id: "f2", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy&backgroundColor=ffdfbf,ffd5dc,ffcbe4", alt: "Female Avatar 2" },
  { id: "f3", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily&backgroundColor=ffdfbf,ffd5dc,ffcbe4", alt: "Female Avatar 3" },
  { id: "f4", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia&backgroundColor=ffdfbf,ffd5dc,ffcbe4", alt: "Female Avatar 4" },
  { id: "f5", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=ffdfbf,ffd5dc,ffcbe4", alt: "Female Avatar 5" },
  { id: "f6", url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=ffdfbf,ffd5dc,ffcbe4", alt: "Female Avatar 6" },
];

interface AvatarSelectorProps {
  selected: string;
  onSelect: (url: string) => void;
}

export default function AvatarSelector({ selected, onSelect }: AvatarSelectorProps) {
  const [activeTab, setActiveTab] = useState("male");
  const avatars = activeTab === "male" ? maleAvatars : femaleAvatars;

  return (
    <div className="space-y-4">
      <Tabs defaultValue="male" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="male">Male</TabsTrigger>
          <TabsTrigger value="female">Female</TabsTrigger>
        </TabsList>
        <TabsContent value="male" className="mt-4">
          <RadioGroup
            value={selected}
            onValueChange={onSelect}
            className="grid grid-cols-3 gap-4"
          >
            {maleAvatars.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center space-y-2">
                <RadioGroupItem
                  value={avatar.url}
                  id={avatar.id}
                  className="sr-only"
                />
                <Label
                  htmlFor={avatar.id}
                  className="cursor-pointer rounded-full p-1 ring-offset-background transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className={`h-16 w-16 ${selected === avatar.url ? 'ring-2 ring-primary' : ''}`}>
                    <AvatarImage src={avatar.url} alt={avatar.alt} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
        <TabsContent value="female" className="mt-4">
          <RadioGroup
            value={selected}
            onValueChange={onSelect}
            className="grid grid-cols-3 gap-4"
          >
            {femaleAvatars.map((avatar) => (
              <div key={avatar.id} className="flex flex-col items-center space-y-2">
                <RadioGroupItem
                  value={avatar.url}
                  id={avatar.id}
                  className="sr-only"
                />
                <Label
                  htmlFor={avatar.id}
                  className="cursor-pointer rounded-full p-1 ring-offset-background transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Avatar className={`h-16 w-16 ${selected === avatar.url ? 'ring-2 ring-primary' : ''}`}>
                    <AvatarImage src={avatar.url} alt={avatar.alt} />
                    <AvatarFallback>?</AvatarFallback>
                  </Avatar>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>
    </div>
  );
}
