import { TLBaseShape, TLDefaultColorStyle } from '@tldraw/tldraw'

// We'll have a custom style called weight
export type ICharacterTypes = "man1" | "man2" | "man3" | "woman1" | "woman2" | "woman3";

// A type for our custom card shape
export type ICardShape = TLBaseShape<
    'character',
    {
        w: number
        h: number
        type: string
    }
>