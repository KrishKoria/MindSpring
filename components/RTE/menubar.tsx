import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { Bold, HistoryIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataStatePropInterceptor } from "./DataWrapper";

interface MenubarProps {
  editor: Editor | null;
}

export default function Menubar({ editor }: MenubarProps) {
  if (!editor) {
    return null;
  }

  const handleBoldClick = () => {
    editor.chain().toggleBold().run();
  };

  return (
    <div className="p-2 border-b">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Toggle
                onPressedChange={handleBoldClick}
                className={cn(
                  editor.isActive("bold") && "bg-muted text-muted-foreground"
                )}
              >
                <Bold />
              </Toggle>
              <span></span>
            </span>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
