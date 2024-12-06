import { useContext, useRef } from "react";
import Plus from "../icons/Plus"
import colors from "../assets/color.json"
import { db } from "../appwrite/databases";
import { NoteContext } from "../context/NoteContext";

const AddButton = () => {
    const {setNotes} = useContext(NoteContext)
    const startingPos = useRef(10)

    const addNote = async () => {
        //console.log("Adding note")
        const payload = {
            position:JSON.stringify({
                x:startingPos.current,
                y:startingPos.current
            }),
            colors: JSON.stringify(colors[0]),
            };
            startingPos.current += 10;
            const response = await db.notes.create(payload)
            setNotes((prevNotes) => [response,...prevNotes])
    }

    return (
        <div id="add-button" onClick={addNote}>
            <Plus/>
        </div>
    )
}

export default AddButton;