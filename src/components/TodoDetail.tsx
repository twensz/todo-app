import "@/components/TodoDetail.css";

import { Bold, Italic, Underline } from "lucide-react";
import { useEffect, useState } from "react";

import { Todo, UpdateTodoBody } from "@/types/todo.type";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import Placeholder from "@tiptap/extension-placeholder";
import { BubbleMenu, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { Input } from "./ui/input";

type TodoDetailProps = {
  todo: Todo | undefined;
  updateTodo: (id: string, body: UpdateTodoBody) => void;
};

const TodoDetail: React.FC<TodoDetailProps> = ({ todo, updateTodo }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [initializeEditorContent, setInitializeEditorContent] = useState(true);

  const extensions = [
    StarterKit,
    Placeholder.configure({
      placeholder: "What needs to be done?",
      showOnlyWhenEditable: true,
      showOnlyCurrent: false,
    }),
  ];
  const editor = useEditor({
    extensions,
    content: description,
    onBlur: () => handleOnBlur({ description }),
  });

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setLoading(false);
    }
  }, [todo]);

  useEffect(() => {
    if (editor && description && !initializeEditorContent) {
      console.log("edit");
      editor.commands.setContent(description);
      setInitializeEditorContent(false);
    }
  }, [editor, description, initializeEditorContent]);

  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => {
      setDescription(editor.getHTML());
    };

    editor.on("update", updateHandler);

    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor]);

  const handleOnBlur = (body: UpdateTodoBody) => {
    const objectKeys = Object.keys(body)[0] as keyof UpdateTodoBody;

    if (!todo?._id || body[objectKeys] === todo?.[objectKeys]) return;

    updateTodo(todo._id, body);
  };

  const handleKeyUpTitleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      editor?.commands.focus();
    }
  };

  if (loading) return null;

  return (
    <>
      <div className="flex flex-col gap-4">
        <Input
          defaultValue={title}
          className={`${
            todo?.completed ? "text-gray-600" : ""
          } border-none focus-visible:ring-0 shadow-none !text-xl !font-bold p-0 rounded-none`}
          placeholder="What you like to do?"
          onBlur={() => handleOnBlur({ title })}
          onChange={(e) => setTitle(e.target.value)}
          onKeyUp={handleKeyUpTitleInput}
        />

        <div className="relative">
          {editor && (
            <BubbleMenu
              editor={editor}
              tippyOptions={{ duration: 100 }}
              className="bg-white border rounded-lg shadow-md p-2">
              <ToggleGroup type="multiple" className="flex gap-2">
                <ToggleGroupItem
                  value="bold"
                  aria-label="Toggle bold"
                  className={`${editor?.isActive("bold") ? "text-blue-600" : ""} cursor-pointer`}
                  onClick={() => editor?.chain().focus().toggleBold().run()}>
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="italic"
                  aria-label="Toggle italic"
                  className={`${editor?.isActive("italic") ? "text-blue-600" : ""} cursor-pointer`}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}>
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="strikethrough"
                  className={`${editor?.isActive("strike") ? "text-blue-600" : ""} cursor-pointer`}
                  onClick={() => editor?.chain().focus().toggleStrike().run()}
                  aria-label="Toggle strikethrough">
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </BubbleMenu>
          )}

          <EditorContent editor={editor} className="rounded min-h-[150px]" />
        </div>
      </div>
    </>
  );
};

export default TodoDetail;
