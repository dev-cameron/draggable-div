import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";

interface DraggableComponentProps {
  children?: React.ReactNode;
}

export default function DraggableComponent ( {children}: DraggableComponentProps) {
  
  const [mouseIsDown, setMouseIsDown] = useState(false);
  const [position, setPosition] = useState({x: 0, y: 0});
  const [mouseDiff, setMouseDiff] = useState({x: 0, y: 0});
  const draggableDivRef = useRef<HTMLDivElement>(null);

  /*
  *  Handle mouse down event, calculates the difference between initial mouse pos and draggable div pos
  *  update mouseDiff state with the difference, use this difference when calculating the new position
  * 
  *  @param e - mouse event where we get the clientX and clientY pos of the mouse
  *  @param ref - ref to the draggable div
  */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    setMouseIsDown(true);
    setMouseDiff({x: e.clientX - (ref.current ? ref.current.offsetLeft : 0), y: e.clientY - (ref.current ? ref.current.offsetTop : 0)})
  }

  const handleMouseFalse = () => {
    setMouseIsDown(false);
  }

  const getPosition = (e: MouseEvent, ref: React.RefObject<HTMLDivElement>) => {
    const coords = {
      x: e.clientX - mouseDiff.x, 
      y: e.clientY - mouseDiff.y
    }
    return coords;
  }

  const handleMouseMove = (e: MouseEvent) => { 
    if (mouseIsDown === true) {
      setPosition(getPosition(e, draggableDivRef));
    }
  }
  
  useEffect(()=>{
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    }
  }, [mouseIsDown, mouseDiff])

  return (
    <div 
      ref={draggableDivRef} 
      onMouseDown={(e)=>handleMouseDown(e, draggableDivRef)} onMouseUp={()=>handleMouseFalse()} onMouseLeave={()=>handleMouseFalse()} 
      className={clsx("z-50 flex flex-col min-w-0 min-h-0 border border-none rounded-xl shadow-md draggable select-none fixed top-0 left-0 text-black overflow-hidden", {
        "bg-white": mouseIsDown === false,
        "bg-slate-100": mouseIsDown === true
      })} 
      style={{left:`${position.x}px`, top:`${position.y}px`}
    }>
      <div className="bg-slate-600 shadow-sm h-8 w-full"></div>
      <div className="flex-1 flex items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
