// import { fakeData as notes } from "../assets/fakeData.js"
import { useContext, useEffect, useState } from "react"
import { db } from "../appwrite/databases"
import NoteCard from "../components/NoteCard"
import { NoteContext } from "../context/NoteContext"
import Controls from "../components/Controls"

const NotesPage = () => {
  const {notes, setNotes} = useContext(NoteContext);
    

  return (
    <div>
    {notes.map((note) => (
      <NoteCard key={note.$id} note={note} />
    ))
    }
    <Controls />
    </div>
  )
}

export default NotesPage