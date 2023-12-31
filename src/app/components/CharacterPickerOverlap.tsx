export type CharacterPickerOverlapProps = {
  showCharacter: boolean;
  setShowCharacter: (show: boolean) => void;
  handleCharacterSelect: (e: any, i: number) => void;
  characterSelected: number;
};
export default function CharacterPickerOverlap({
  showCharacter,
  setShowCharacter,
  handleCharacterSelect,
  characterSelected,
}: CharacterPickerOverlapProps) {
  return (
    <>
      {showCharacter && (
        <div
          draggable={false}
          className="absolute -top-[25.5rem]
         w-72 h-96 rounded-md -left-1/2 bg-gray-200 text-white 
        text-xs justify-center
        shadow-sm z-[300] pointer-events-auto
        grid grid-cols-2 gap-2 p-3
        row-span-2 overflow-y-auto
        "
        >
          {Array.from({ length: 24 }).map((_, i) => (
            <button
              className={`w-full h-40 rounded-sm bg-white shadow-sm hover:shadow-md transition-shadow ${
                characterSelected === i ? "ring-2 ring-red-500" : ""
              }`}
              onClick={(e) => {
                handleCharacterSelect(e, i);
              }}
              key={"character-" + i}
              draggable={false}
            >
              <span className="material-symbols-outlined" draggable={false}>
                <img src={`/icons/character${i + 1}.svg`} draggable={false} />
              </span>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
