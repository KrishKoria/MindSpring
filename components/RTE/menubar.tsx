import { type Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Redo,
  Strikethrough,
  Undo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useCallback, useEffect, useState } from "react";

interface MenubarProps {
  editor: Editor | null;
}

export default function Menubar({ editor }: MenubarProps) {
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const updateUndoRedoState = () => {
      setCanUndo(editor.can().undo());
      setCanRedo(editor.can().redo());
    };

    updateUndoRedoState();

    editor.on("transaction", updateUndoRedoState);

    return () => {
      editor.off("transaction", updateUndoRedoState);
    };
  }, [editor]);

  const handleUndo = useCallback(() => {
    if (editor) {
      editor.chain().focus().undo().run();
    }
  }, [editor]);

  const handleRedo = useCallback(() => {
    if (editor) {
      editor.chain().focus().redo().run();
    }
  }, [editor]);

  const handleBulletList = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleBulletList().run();
    }
  }, [editor]);
  const handleOrderedList = useCallback(() => {
    if (editor) {
      editor.chain().focus().toggleOrderedList().run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-input border-t-0 border-x-0 rounded-t-lg p-2 bg-card flex flex-wrap gap-1 items-center">
      <TooltipProvider>
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().focus().toggleBold().run()
                  }
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
                  onPressedChange={() =>
                    editor.chain().focus().toggleItalic().run()
                  }
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
                  onPressedChange={() =>
                    editor.chain().focus().toggleStrike().run()
                  }
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
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
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
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
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
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
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
                  onPressedChange={handleBulletList}
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
                  onPressedChange={handleOrderedList}
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
        <div className="flex flex-wrap gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={cn(
                    editor.isActive({
                      textAlign: "left",
                    }) && "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignLeft />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Left Align Text</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={cn(
                    editor.isActive({
                      textAlign: "center",
                    }) && "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignCenter />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Center Align Text</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Toggle
                  onPressedChange={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={cn(
                    editor.isActive({
                      textAlign: "right",
                    }) && "bg-muted text-muted-foreground"
                  )}
                >
                  <AlignRight />
                </Toggle>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Right Align Text</TooltipContent>
          </Tooltip>
        </div>
        <div className="w-px h-6 bg-border mx-2"></div>
        <div className="flex flex-wrap gap-1">
          <Button
            size={"sm"}
            variant={"ghost"}
            type="button"
            onClick={handleUndo}
            disabled={!canUndo}
          >
            <Undo />
          </Button>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  type="button"
                  onClick={handleRedo}
                  disabled={!canRedo}
                >
                  <Redo />
                </Button>
                <span></span>
              </span>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  );
}
