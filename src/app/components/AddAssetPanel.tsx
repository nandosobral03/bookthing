import { AnimatePresence, motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

import { Cross1Icon } from "@radix-ui/react-icons"
import React from "react"

export type AddAssetPanelProps = {
    showAssetPanel: boolean
    setShowAssetPanel: (show: boolean) => void
    addAsset: (url: string) => void,
    setIsTyping: (isTyping: boolean) => void
}

export default function AddAssetPanel({ showAssetPanel, setShowAssetPanel, addAsset, setIsTyping }: AddAssetPanelProps) {
    const [assetUrl, setAssetUrl] = useState<string>("")
    const [error, setError] = useState<string>("")
    const inputRef = useRef<HTMLInputElement>(null)
    const validateUrl = (url: string) => {
        if (url.startsWith("https://") || url.startsWith("http://")) {
            return true
        }
        return false
    }

    const handleSubmit = () => {
        if (validateUrl(assetUrl)) {
            addAsset(assetUrl)
            setIsTyping(false)
            setShowAssetPanel(false)

        } else {
            alert("Please enter a valid URL")
        }
    }


    useEffect(() => {
        let setTypingTrue = () => { setIsTyping(true) }
        let setTypingFalse = () => { setIsTyping(false) }
        console.log("inputRef.current", inputRef.current)

        inputRef.current?.addEventListener("focus", setTypingTrue)
        inputRef.current?.addEventListener("blur", setTypingFalse)

        return () => {
            inputRef.current?.removeEventListener("focus", setTypingTrue)
            inputRef.current?.removeEventListener("blur", setTypingFalse)
        }
    }, [showAssetPanel])

    return (<AnimatePresence>
        {
            showAssetPanel &&
            <motion.div className="fixed inset-0 z-[300] pointer-events-auto 
            w-96 h-fit rounded-md ml-auto top-0 m-8 bg-gray-200 
            shadow-sm p-4 flex flex-col gap-2"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
            >
                <div className="flex justify-between items-center gap-2">
                    <h1 className="text-2xl">Add new asset
                    </h1>
                    <button onClick={() => setShowAssetPanel(false)}>
                        <Cross1Icon />
                    </button>
                </div>
                <input
                    ref={inputRef}
                    type="text" value={assetUrl} onChange={(e) => setAssetUrl(e.target.value)} className="border-2 border-gray-400 rounded-md p-2" />
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-32 self-end"
                    onClick={() => handleSubmit()}>
                    Add
                </button>
            </motion.div >
        }
    </AnimatePresence>)

}