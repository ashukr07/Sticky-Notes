import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import { db } from "../appwrite/databases";

const Color = ({ color }) => {
    const {notes,setNotes, selectedNote} = useContext(NoteContext)
    const changeColor = async () => {
        //console.log("Changing color: ", selectedNote)
        try {
            const currentNoteIndex = notes.findIndex((note) => note.$id === selectedNote.$id);
            const updatedNote = {
                ...notes[currentNoteIndex],
                colors: JSON.stringify(color),
            }
            const newNotes = [...notes];    
            newNotes[currentNoteIndex] = updatedNote;
            setNotes(newNotes);
            await db.notes.update(selectedNote.$id, {
                colors: JSON.stringify(color),
            });
        } catch (error) {
            alert("You must select a note before changing color")
        }

    };
    return (
        <div
            className="color"
            style={{ backgroundColor: color.colorHeader}}
            onClick={changeColor}
        ></div>
    )
}

export default Color;