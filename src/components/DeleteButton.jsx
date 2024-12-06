import Trash from "../icons/Trash";
import { db } from "../appwrite/databases";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext.jsx";

const DeleteButton = ({notesId}) => {
    const {setNotes} = useContext(NoteContext)

    
    const handleDelete = async (e) =>{
        // e.preventDefault();
        await db.notes.delete(notesId);
        setNotes(prevNotes => prevNotes.filter(note => note.$id !== notesId))
    };

    return (
        <div onClick = {handleDelete}>
            <Trash/>
        </div>
    )
}
export default DeleteButton;