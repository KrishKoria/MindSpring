import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  HistoryIcon,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MenubarProps {
  editor: Editor | null;
}

export default function Menubar({ editor }: MenubarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() => editor.chain().toggleBold().run()}
                  className={cn(
                    editor.isActive("bold") && "bg-muted text-muted-foreground"
                  )}
                >
                  <Bold />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() => editor.chain().toggleItalic().run()}
                  className={cn(
                    editor.isActive("italic") &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <Italic />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() => editor.chain().toggleStrike().run()}
                  className={cn(
                    editor.isActive("strike") &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <Strikethrough />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Strikethrough</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().toggleHeading({ level: 1 }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level: 1 }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <Heading1 />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().toggleHeading({ level: 2 }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level: 2 }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <Heading2 />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().toggleHeading({ level: 3 }).run()
                  }
                  className={cn(
                    editor.isActive("heading", { level: 3 }) &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <Heading3 />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().toggleBulletList().run()
                  }
                  className={cn(
                    editor.isActive("bulletList") &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <List />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Bullet List</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().toggleOrderedList().run()
                  }
                  className={cn(
                    editor.isActive("orderedList") &&
                      "bg-muted text-muted-foreground"
                  )}
                >
                  <ListOrdered />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Ordered List</TooltipContent>
          </Tooltip>
        </div>
        <div className="w-px h-6 bg-border mx-2"></div>
      </TooltipProvider>
    </div>
  );
}
