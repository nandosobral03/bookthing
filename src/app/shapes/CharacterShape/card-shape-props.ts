import { DefaultColorStyle, ShapeProps, StyleProp, T } from '@tldraw/tldraw'

import { ICardShape } from './card-shape-types'

// Validation for our custom card shape's props, using our custom style + one of tldraw's default styles
export const cardShapeProps: ShapeProps<ICardShape> = {
    w: T.number,
    h: T.number,
    type: T.string,
}