import { CheckIcon, Pencil1Icon, Cross1Icon } from "@radix-ui/react-icons";
import {
  TLImageAsset,
  TLVideoAsset,
  Editor,
  TLBookmarkAsset,
} from "@tldraw/tldraw";
import { useEffect, useRef, useState } from "react";

export type SingleAssetElementProps = {
  asset: TLImageAsset | TLVideoAsset | TLBookmarkAsset;
  editor: Editor;
  setRefresher: (refresher: number) => void;
  refresher: number;
  setIsTyping: (isTyping: boolean) => void;
};

export default function SingleAssetElement({
  asset,
  editor,
  setRefresher,
  refresher,
  setIsTyping,
}: SingleAssetElementProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let setTypingTrue = () => {
      console.log("setTypingTrue");
      setIsTyping(true);
    };
    let setTypingFalse = () => {
      setIsTyping(false);
    };
    console.log("inputRef.current", inputRef.current);

    inputRef.current?.addEventListener("focus", setTypingTrue);
    inputRef.current?.addEventListener("blur", setTypingFalse);

    return () => {
      inputRef.current?.removeEventListener("focus", setTypingTrue);
      inputRef.current?.removeEventListener("blur", setTypingFalse);
    };
  }, [isEditing]);

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement>,
    asset: TLImageAsset | TLVideoAsset | TLBookmarkAsset
  ) => {
    if (e.key === "Enter") {
      editor.updateAssets([
        // @ts-ignore
        { id: asset.id, props: { ...asset.props, name: newName.trim() } },
      ]);
      setIsEditing(false);
      setRefresher(refresher + 1);
    }
  };

  return (
    <div key={asset.id} className="flex items-center gap-2">
      <button
        className="w-10 h-10 rounded-sm bg-white shadow-sm hover:shadow-md 
        transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
         focus:ring-offset-2 focus:ring-offset-white pointer-events-auto grid place-items-center"
        onClick={() => {
          console.log("editor.camera", editor.camera);
          editor.createShape({
            type: "image",
            props: {
              assetId: asset.id,
              w: 250,
              h: 250,
            },
          });
        }}
      >
        <img
          src={asset.props.src || ""}
          className="w-10 h-10"
          alt="asset"
          draggable={false}
        />
      </button>
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onKeyUp={(e) => handleKeyUp(e, asset)}
          onChange={(e) => setNewName(e.target.value)}
          className="border-2 border-gray-400 rounded-md p-2"
          ref={inputRef}
        />
      ) : (
        <p>{(asset.props as any).name || "Untitled"}</p>
      )}
      <button
        className="ml-auto"
        onClick={() => {
          if (isEditing) {
            setIsEditing(false);
            editor.updateAssets([
              // @ts-ignore
              {
                id: asset.id,
                props: { ...asset.props, name: newName.trim() },
              },
            ]);
            setRefresher(refresher + 1);
          } else {
            setIsEditing(true);
            setNewName((asset.props as any).name || "Untitled");
          }
        }}
      >
        {isEditing ? <CheckIcon /> : <Pencil1Icon />}
      </button>

      <button
        onClick={() => {
          editor.deleteAssets([asset.id]);
          setRefresher(refresher + 1);
        }}
      >
        <Cross1Icon />
      </button>
    </div>
  );
}
