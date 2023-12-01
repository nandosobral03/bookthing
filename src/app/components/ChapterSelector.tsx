import { Editor } from "@tldraw/tldraw";
import { useState } from "react";

export type ChapterSelectorProps = {
  editor: Editor;
};

export default function ChapterSelector({ editor }: ChapterSelectorProps) {
  const [currentPage, setCurrentPage] = useState("a1");

  const handleSelectPage = (n : string) => {
    // setCurrentPage(n);
    editor.setCurrentPage(n as any);
  }

  const createNewPage = () => {
    editor.createPage({name: "New Chapter"});
  }


  return (
    <div className="absolute left-2 top-[10%] h-4/5 flex items-center justify-start gap-4 px-4 py-4 bg-gray-200 rounded-md shadow-sm z-[300] w-48 flex-col">
      <h1 className="text-xl font-bold">Chapters</h1>
      {editor.pages.map((page, i) => ( 
        <button className="flex gap-4 bg-gray-300 p-2 w-full rounded-md outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-white focus:outline-none" onClick={() => handleSelectPage(page.id)}>
          {page.name}
        </button>
      ))} 
      
      <button className="flex gap-4 bg-gray-300 p-2 w-full rounded-md outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-white focus:outline-none" onClick={() => createNewPage()}>
        New Chapter
      </button>
    </div>
  );
}
