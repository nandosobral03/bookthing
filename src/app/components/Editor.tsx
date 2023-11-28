"use client"

import { AssetRecordType, MediaHelpers, TLAsset, TLAssetId, Tldraw, getHashForString, isGifAnimated, uniqueId } from "@tldraw/tldraw"

import BookUI from "./BookUI"
import { CardShapeTool } from '../shapes/CharacterShape/CardShapeTool'
import { CardShapeUtil } from '../shapes/CharacterShape/CardShapeUtil'
import { useCallback } from "react"

const customShapeUtils = [CardShapeUtil]
const customTools = [CardShapeTool]

export default function Editor() {

    const handleMount = useCallback((editor: any) => {
        // When a user uploads a file, create an asset from it
        editor.registerExternalAssetHandler('file', async ({ file }: { type: 'file'; file: File }) => {
            const id = uniqueId()

            const objectName = `${id}-${file.name}`.replaceAll(/[^a-zA-Z0-9.]/g, '-')
            let url = "https://placehold.co/600x400"

            const assetId: TLAssetId = AssetRecordType.createId(getHashForString(url))

            let size: {
                w: number
                h: number
            }
            let isAnimated: boolean
            let shapeType: 'image' | 'video'

            if (['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(file.type)) {
                shapeType = 'image'
                size = await MediaHelpers.getImageSizeFromSrc(url)
                isAnimated = file.type === 'image/gif' && (await isGifAnimated(file))
            } else {
                shapeType = 'video'
                isAnimated = true
                size = await MediaHelpers.getVideoSizeFromSrc(url)
            }

            const asset: TLAsset = AssetRecordType.create({
                id: assetId,
                type: shapeType,
                typeName: 'asset',
                props: {
                    name: file.name,
                    src: url,
                    w: size.w,
                    h: size.h,
                    mimeType: file.type,
                    isAnimated,
                },
            })


            return asset
        })
    }, [])

    return (
        <div className="grow w-100 bg-white" draggable="false">
            <Tldraw hideUi
                shapeUtils={customShapeUtils}
                tools={customTools}
                persistenceKey="my-persistence-key"
            // onMount={handleMount}

            // Pass in any overrides to the user interface
            >
                <BookUI />
            </Tldraw>
        </div>
    )
}