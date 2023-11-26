"use client"

import BookUI from "./BookUI"
import { CardShapeTool } from '../shapes/CharacterShape/CardShapeTool'
import { CardShapeUtil } from '../shapes/CharacterShape/CardShapeUtil'
import { Tldraw } from "@tldraw/tldraw"

const customShapeUtils = [CardShapeUtil]
const customTools = [CardShapeTool]

export default function Editor() {
    return (
        <div className="grow w-100 bg-white" draggable="false">
            <Tldraw hideUi
                shapeUtils={customShapeUtils}
                tools={customTools}


            // Pass in any overrides to the user interface
            >
                <BookUI />
            </Tldraw>
        </div>
    )
}