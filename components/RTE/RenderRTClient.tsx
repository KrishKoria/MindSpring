import { type JSONContent, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";

export default function RenderRTClient({ content }: { content: JSONContent }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content,
    editable: false,
    immediatelyRender: false,
  });
  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary ">
      <EditorContent editor={editor} />
    </div>
  );
}
