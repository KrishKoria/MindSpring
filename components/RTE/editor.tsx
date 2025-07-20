import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Menubar from "./menubar";

const RTEditor = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
  });

  return (
    <div>
      <Menubar editor={editor} />
    </div>
  );
};

export default RTEditor;
