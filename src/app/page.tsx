// import global css
import "./globals.css"
import '@tldraw/tldraw/tldraw.css'

import Editor from "./components/Editor"
import Head from "next/head"
import { Metadata } from "next"

// metadata
export const metadata: Metadata = {
  title: "Book",
}

export default function Home() {
  return (
    <>
      <div className="w-screen h-screen bg-gray-100 flex flex-col">
        Tetst

        <Editor />
      </div>
    </>
  )
}