import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menubar";
import TextAlign from "@tiptap/extension-text-align";
import { BulletList, ListItem, OrderedList } from "@tiptap/extension-list";

const RTEditor = ({ field }: { field: any }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      field.onChange(JSON.stringify(json));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Hello World!</p>",
  });

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <Menubar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RTEditor;
