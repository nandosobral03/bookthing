import {
    HTMLContainer,
    Rectangle2d,
    ShapeUtil,
    TLOnResizeHandler,
    getDefaultColorTheme,
    resizeBox,
} from '@tldraw/tldraw'
import { useState } from 'react'
import { cardShapeMigrations } from './card-shape-migrations'
import { cardShapeProps } from './card-shape-props'
import { ICardShape } from './card-shape-types'
// A utility class for the card shape. This is where you define
// the shape's behavior, how it renders (its component and
// indicator), and how it handles different events.

export class CardShapeUtil extends ShapeUtil<ICardShape> {
    static override type = 'character' as const
    // A validation schema for the shape's props (optional)
    static override props = cardShapeProps
    // Migrations for upgrading shapes (optional)
    static override migrations = cardShapeMigrations

    // Flags
    override isAspectRatioLocked = (_shape: ICardShape) => false
    override canResize = (_shape: ICardShape) => true
    override canBind = (_shape: ICardShape) => true

    getDefaultProps(): ICardShape['props'] {
        return {
            w: 300,
            h: 300,
            type: "1"
        }
    }

    getGeometry(shape: ICardShape) {
        return new Rectangle2d({
            width: shape.props.w,
            height: shape.props.h,
            isFilled: true,
        })
    }

    // Render method — the React component that will be rendered for the shape
    component(shape: ICardShape) {
        const bounds = this.editor.getShapeGeometry(shape).bounds
        return (
            <>
                <img src={`/icons/character${shape.props.type}.svg`} style={{ width: bounds.width, height: bounds.height }} />
            </>
        )
    }

    // Indicator — used when hovering over a shape or when it's selected; must return only SVG elements here
    indicator(shape: ICardShape) {
        return <rect width={shape.props.w} height={shape.props.h} />
    }

    // Events
    override onResize: TLOnResizeHandler<ICardShape> = (shape, info) => {
        return resizeBox(shape, info)
    }
}