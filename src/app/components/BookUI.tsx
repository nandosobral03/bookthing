"use client";

import {
  ArrowRightIcon,
  CursorArrowIcon,
  DownloadIcon,
  EraserIcon,
  ImageIcon,
  Pencil1Icon,
  PersonIcon,
  TextIcon,
} from "@radix-ui/react-icons";
import {
  AssetRecordType,
  MediaHelpers,
  TLAsset,
  TLAssetId,
  TLShapeId,
  TLTextShapeProps,
  getHashForString,
  isGifAnimated,
  useEditor,
} from "@tldraw/tldraw";
import { useEffect, useRef, useState } from "react";

import AddAssetPanel from "./AddAssetPanel";
import CharacterPickerOverlap from "./CharacterPickerOverlap";

type TLDrawToolId =
  | "select"
  | "draw"
  | "eraser"
  | "arrow"
  | "character"
  | "text"
  | "save";
type ToolId = TLDrawToolId | "asset";
const toolsThatLoseSelection: ToolId[] = ["arrow"];
export type BookUIProps = {};

export type Tool = {
  id: ToolId;
  name: string;
  icon: any;
  overlappedComponent?: any;
  className?: string;
  onClick: () => void;
  ref?: any;
};
export default function BookUI({}: BookUIProps) {
  const editor = useEditor();
  const [current, setCurrent] = useState<ToolId>("select");
  const [isTyping, setIsTyping] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(0);
  const [showAssetPanel, setShowAssetPanel] = useState(false);
  let imageButton = useRef<HTMLButtonElement>(null);
  const setCurrentTool = (toolId: ToolId) => {
    if (toolId !== "character") {
      setShowCharacter(false);
    }
    editor.setCurrentTool(toolId);
    setCurrent(toolId);
  };

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (isTyping) return;
      switch (e.key) {
        case "Delete":
        case "Backspace": {
          editor.deleteShapes(editor.selectedShapeIds);
          break;
        }
        case "s": {
          setCurrentTool("select");
          break;
        }
        case "e": {
          setCurrentTool("eraser");
          break;
        }
        case "d": {
          setCurrentTool("draw");
          break;
        }
        case "z": {
          if (e.ctrlKey) {
            editor.undo();
          }
          break;
        }
        case "y": {
          if (e.ctrlKey) {
            editor.redo();
          }
          break;
        }
        case "t": {
          setCurrentTool("text");
          break;
        }
        case "a": {
          setCurrentTool("arrow");
          break;
        }
      }
    };

    const handleChange = (e: any) => {
      let changes = e.changes;

      if (Object.keys(changes.added).some((key) => key.includes("shape:"))) {
        let shapeId = Object.keys(changes.added).find((key) =>
          key.includes("shape:")
        )!;
        let type = changes.added[shapeId].type;
        switch (type) {
          case "character": {
            editor.updateShape({
              id: shapeId as TLShapeId,
              props: { type: selectedCharacter.toString() },
            } as any);
            setCurrentTool("select");
            break;
          }
        }
      }

      if (
        Object.keys(changes.updated).every((key) =>
          key.includes("pointer:pointer")
        )
      )
        return;
      if (
        Object.keys(changes.updated).includes("instance_page_state:page:page")
      ) {
        if (
          changes.updated["instance_page_state:page:page"][0].selectedShapeIds
            .length > 0
        ) {
          if (toolsThatLoseSelection.includes(current)) {
            setCurrentTool("select");
          }
          return;
        }
      }

      if (Object.keys(changes.updated).some((key) => key.includes("shape:"))) {
        let shapeId = Object.keys(changes.updated).find((key) =>
          key.includes("shape:")
        )!;
        if (
          changes.updated[shapeId].some((change: any) => change.type === "text")
        ) {
          setIsTyping(true);
          let shape = editor.getShape(shapeId as TLShapeId);
          if ((shape?.props as TLTextShapeProps).font == "sans") return;
          editor.updateShape({
            id: shapeId as TLShapeId,
            props: { font: "sans" },
          } as any);
        }
      } else {
        if (isTyping) {
          setIsTyping(false);
          setCurrentTool("select");
        }
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    editor.addListener("change", handleChange);
    return () => {
      window.removeEventListener("keyup", handleKeyUp);
      editor.removeListener("change", handleChange);
    };
  });

  const handleClickCharacter = () => {
    showCharacter ? setShowCharacter(false) : setShowCharacter(true);
    setCurrentTool("character");
    // setCurrent('character')
  };

  const handleCharacterSelect = (e: any, i: number) => {
    setSelectedCharacter(i + 1);
  };

  const addAsset = async (url: string) => {
    const assetId: TLAssetId = AssetRecordType.createId(getHashForString(url));

    let size: {
      w: number;
      h: number;
    };
    let isAnimated: boolean;
    let shapeType: "image" | "video";

    let file = await fetch(url)
      .then((res) => res.blob())
      .then((blob) => new File([blob], "file", { type: blob.type }));
    console.log(file);
    if (
      ["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(
        file.type
      )
    ) {
      shapeType = "image";
      size = await MediaHelpers.getImageSizeFromSrc(url);
      isAnimated = file.type === "image/gif" && (await isGifAnimated(file));
    } else {
      shapeType = "video";
      isAnimated = true;
      size = await MediaHelpers.getVideoSizeFromSrc(url);
    }
    console.log(size, shapeType, isAnimated);
    const asset: TLAsset = AssetRecordType.create({
      id: assetId,
      type: shapeType,
      typeName: "asset",
      props: {
        name: file.name,
        src: url,
        w: size.w,
        h: size.h,
        mimeType: file.type,
        isAnimated,
      },
    });

    editor.createAssets([asset]);
    editor.createShape({
      type: "image",
      props: {
        assetId: asset.id,
        w: size.w,
        h: size.h,
      },
    });
    console.log(editor.assets);
  };

  function handleAssetButton() {
    setShowAssetPanel((x) => !x);
    // blur button to prevent double click
    imageButton.current?.blur();
    setCurrentTool("select");
  }

  const tools: Tool[] = [
    {
      id: "select",
      name: "Select",
      icon: <CursorArrowIcon />,
      onClick: () => setCurrentTool("select"),
    },
    {
      id: "arrow",
      name: "Arrow",
      icon: <ArrowRightIcon />,
      onClick: () => setCurrentTool("arrow"),
    },
    {
      id: "draw",
      name: "Draw",
      icon: <Pencil1Icon />,
      onClick: () => setCurrentTool("draw"),
    },
    {
      id: "eraser",
      name: "Eraser",
      icon: <EraserIcon />,
      onClick: () => setCurrentTool("eraser"),
    },
    {
      id: "character",
      name: "Character",
      icon: <PersonIcon />,
      onClick: () => handleClickCharacter(),
      className: "relative",
      overlappedComponent: (
        <CharacterPickerOverlap
          showCharacter={showCharacter}
          setShowCharacter={setShowCharacter}
          handleCharacterSelect={handleCharacterSelect}
          characterSelected={selectedCharacter - 1}
        />
      ),
    },
    {
      id: "text",
      name: "Text",
      icon: <TextIcon />,
      onClick: () => setCurrentTool("text"),
    },
    {
      id: "asset",
      name: "Asset",
      icon: <ImageIcon />,
      onClick: () => handleAssetButton(),
      ref: imageButton,
    },
    {
      id: "save",
      name: "Save",
      icon: <DownloadIcon />,
      onClick: () => handleSave(),
      overlappedComponent: (
        <AddAssetPanel
          showAssetPanel={showAssetPanel}
          setShowAssetPanel={setShowAssetPanel}
          addAsset={addAsset}
          setIsTyping={setIsTyping}
          editor={editor}
        />
      ),
    },
  ];

  const handleSave = () => {
    const snapshot = editor.store.getSnapshot();
    const stringified = JSON.stringify(snapshot);
    localStorage.setItem("my-editor-snapshot", stringified);
  };

  return (
    <>
      <div className="absolute inset-0 z-[300] pointer-events-none flex items-center justify-center">
        <div className="absolute bottom-2 flex items-center justify-center gap-4 px-8 py-4 bg-gray-200 rounded-md shadow-sm">
          {tools.map((tool) => (
            <div className={tool.className} key={tool.id}>
              <button
                className={`
                            w-10 h-10 rounded-sm bg-white shadow-sm hover:shadow-md transition-shadow 
                            duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 
                            focus:ring-offset-2 focus:ring-offset-white pointer-events-auto
                            grid place-items-center ${
                              current === tool.id ? "ring-2 ring-red-500" : ""
                            }
                            `}
                ref={tool.ref ?? null}
                onClick={tool.onClick}
              >
                <span className="material-symbols-outlined">{tool.icon}</span>
              </button>
              {tool.overlappedComponent}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
