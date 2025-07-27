import { useMemo } from "react";
import { type JSONContent } from "@tiptap/react";
import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

export default function RenderRT({ content }: { content: JSONContent }) {
  const output = useMemo(() => {
    return generateHTML(content, [
      StarterKit,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ]);
  }, [content]);
  return (
    <div className="prose dark:prose-invert prose-li:marker:text-primary ">
      {parse(output)}
    </div>
  );
}
