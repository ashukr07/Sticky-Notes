import { useRef, useState, useContext, useEffect } from "react"
import DeleteButton from "./DeleteButton"
import { autoGrow, bodyParser, setNewOffset, setZIndex } from "../utils"
import { db } from "../appwrite/databases"
import Spinner from "../icons/Spinner"
import { NoteContext } from "../context/NoteContext"

const NoteCard = ({note}) => {
    const {setSelectedNote} = useContext(NoteContext)
    const cardRef = useRef(null)

    const [position,setPosition] = useState(JSON.parse(note.position))
    const colors = JSON.parse(note.colors)
    const body = bodyParser(note.body)

    const [saving, setSaving] = useState(false);

    const keyUpTimer = useRef(null);
    const handleKeyUp = async () => {
        //intiating the saving state
        setSaving(true)

        //2. if we have previous timer id, clear it so we can add another 2seconds
        if(keyUpTimer.current){
            clearTimeout(keyUpTimer.current)
        }
        
        //3. set the new timer to trigger save in 2 seconds
        keyUpTimer.current = setTimeout(()=>{
            saveData("body",textAreaRef.current.value);
        },2000)
    }

    const textAreaRef = useRef(null)
    useEffect(()=>{
        autoGrow(textAreaRef);
        setZIndex(cardRef.current)
    },[])
    

    let mouseStartPos = {x:0,y:0}
    
    //to get the distance card has moved we need the mouse starting position
    const mouseDown = (e)=>{
        //this is to make sure we are only moving the card when we click on the header
        //otherwise when we click on the trash icon also it will try to update but it is deleted so it will throw an error
        if(e.target.className === "card-header"){
            setSelectedNote(note)
            setZIndex(cardRef.current)
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;
        document.addEventListener("mousemove",mouseMove)
        document.addEventListener("mouseup",mouseUp)
        }
        
    }

    const mouseMove = (e)=>{
        //1. calculate the distance the mouse has moved
        let mouseMoveDir = {
            x:mouseStartPos.x-e.clientX,
            y:mouseStartPos.y-e.clientY
        }
        //2.update the mouse start position for mext
        mouseStartPos.x = e.clientX;
        mouseStartPos.y = e.clientY;

        //3. update the card top and left position
        const newPosition = setNewOffset(cardRef.current,mouseMoveDir)
        setPosition(newPosition)
    }

    const mouseUp = ()=>{
        document.removeEventListener("mousemove",mouseMove)
        document.removeEventListener("mouseup",mouseUp)
        const newPosition = setNewOffset(cardRef.current)
        saveData("position",newPosition)
    }

    const saveData = async (key , value) => {
        const payload = {
            [key]:JSON.stringify(value)
            //[] is used to make the key dynamic
            // as it will be the string of the key
        }
        //console.log("Data saved",payload)
        try {
            await db.notes.update(note.$id,payload)
        } catch (error) {
            console.error(error)
        }
        setSaving(false)
    }

  return (
    <div
    ref={cardRef}
    className="card"
    style={{
        backgroundColor: colors.colorBody,
        left:`${position.x}px`,
        top:`${position.y}px`,
    }}
    >
        <div
        className="card-header"
        onMouseDown={mouseDown}
        style={{backgroundColor: colors.colorHeader}}
        >
            <DeleteButton notesId={note.$id} />
            {
                saving && (
                    <div className="card-saving">
                        <Spinner color={colors.colorText} />
                        <span style={{color:colors.colorText}}>Saving...</span>
                    </div>
                )
            }
        </div>
        <div className="card-body">
            <textarea 
            ref={textAreaRef}
            onInput={()=>autoGrow(textAreaRef)}
            onFocus={()=>{
                setZIndex(cardRef.current)
                setSelectedNote(note)
            }}
            onKeyUp={handleKeyUp}
            style={{color: colors.colorText}}
            defaultValue={body}
            >
            </textarea>
        </div>
    </div>
  )
}

export default NoteCard