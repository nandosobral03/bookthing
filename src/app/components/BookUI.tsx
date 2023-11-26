"use client"

import { ArrowRightIcon, CodeIcon, CursorArrowIcon, EraserIcon, Pencil1Icon, PersonIcon, TextIcon } from "@radix-ui/react-icons"
import { TLShapeId, TLTextShapeProps, useEditor } from "@tldraw/tldraw"
import { useEffect, useState } from "react"

type ToolId = 'select' | 'draw' | 'eraser' | 'arrow' | 'character' | 'text'
const toolsThatLoseSelection: ToolId[] = ['arrow', 'character']
export type BookUIProps = {
}

export type Tool = {
    id: ToolId
    name: string
    icon: any
    onClick: () => void
}
export default function BookUI({ }: BookUIProps) {
    const editor = useEditor()
    const [current, setCurrent] = useState<ToolId>('select')
    const [isTyping, setIsTyping] = useState(false)
    const setCurrentTool = (toolId: ToolId) => {
        editor.setCurrentTool(toolId)
        setCurrent(toolId)
    }

    useEffect(() => {
        const handleKeyUp = (e: KeyboardEvent) => {
            if (isTyping) return;
            switch (e.key) {
                case 'Delete':
                case 'Backspace': {
                    editor.deleteShapes(editor.selectedShapeIds)
                    break
                }
                case 's': {
                    setCurrentTool('select')
                    break
                }
                case 'e': {
                    setCurrentTool('eraser')
                    break
                }
                case 'd': {
                    setCurrentTool('draw')
                    break
                }
                case 'z': {
                    if (e.ctrlKey) {
                        editor.undo()
                    }
                    break
                }
                case "y": {
                    if (e.ctrlKey) {
                        editor.redo()
                    }
                    break
                }
                case "t": {
                    setCurrentTool('text')
                    break
                }
                case "c": {
                    setCurrentTool('character')
                    break
                }
                case 'a': {
                    setCurrentTool('arrow')
                    break

                }
            }
        }

        const handleDrag = (e: any) => {
            let changes = e.changes;
            if (Object.keys(changes.updated).every((key) => key.includes("pointer:pointer"))) return;
            if (Object.keys(changes.updated).includes("instance_page_state:page:page")) {
                if (changes.updated["instance_page_state:page:page"][0].selectedShapeIds.length > 0) {
                    if (toolsThatLoseSelection.includes(current)) {
                        setCurrentTool('select')
                    }
                    return;
                }
            }
            if (Object.keys(changes.updated).some((key) => key.includes("shape:"))) {
                let shapeId = Object.keys(changes.updated).find((key) => key.includes("shape:"))!
                if (changes.updated[shapeId].some((change: any) => change.type === "text")) {
                    setIsTyping(true)
                    let shape = editor.getShape(shapeId as TLShapeId)
                    if ((shape?.props as TLTextShapeProps).font == 'sans') return;
                    editor.updateShape({ id: shapeId as TLShapeId, props: { font: 'sans' } } as any)
                }
            } else {
                if (isTyping) {
                    setIsTyping(false)
                    setCurrentTool('select')
                }
            }
        }

        window.addEventListener('keyup', handleKeyUp)
        editor.addListener('change', handleDrag)
        return () => {
            window.removeEventListener('keyup', handleKeyUp)
            editor.removeListener('change', handleDrag)
        }
    })

    const tools: Tool[] = [
        {
            id: 'select',
            name: 'Select',
            icon: <CursorArrowIcon />,
            onClick: () => setCurrentTool('select')
        },
        {
            id: 'arrow',
            name: 'Arrow',
            icon: <ArrowRightIcon />,
            onClick: () => setCurrentTool('arrow')
        },
        {
            id: 'draw',
            name: 'Draw',
            icon: <Pencil1Icon />,
            onClick: () => setCurrentTool('draw')
        },
        {
            id: 'eraser',
            name: 'Eraser',
            icon: <EraserIcon />,
            onClick: () => setCurrentTool('eraser')
        },
        {
            id: 'character',
            name: 'Character',
            icon: <PersonIcon />,
            onClick: () => setCurrentTool('character')
        },
        {
            id: 'text',
            name: 'Text',
            icon: <TextIcon />,
            onClick: () => setCurrentTool('text')
        }
    ]



    return (
        <>
            <div className="absolute inset-0 z-[300] pointer-events-none flex items-center justify-center">
                <div className="absolute bottom-2 flex items-center justify-center gap-4 px-8 py-4 bg-gray-200 rounded-md">
                    {tools.map((tool) => (
                        <button
                            key={tool.id}
                            className={`
                            w-10 h-10 rounded-sm bg-white shadow-sm hover:shadow-md transition-shadow 
                            duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 
                            focus:ring-offset-2 focus:ring-offset-white pointer-events-auto
                            grid place-items-center ${current === tool.id ? 'ring-2 ring-red-500' : ''}
                            `}
                            onClick={tool.onClick}
                        >
                            <span className="material-symbols-outlined">
                                {tool.icon}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </>

    )
}