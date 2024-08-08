import { useCallback, useState } from "react";
import './genericbutton.css';
import { validateMouseDown, validateMouseLeave, validateMouseUp } from "../utils/GenericClick";

export function GenericButton({onClick,children,className}) {
	const [pressed,setPressd] = useState(false);
	const handlePressed = {
		mouseDown:(e)=>{
			if(validateMouseDown(e)) {
				setPressd(true);
			} else {
				return;
			}
		},
		mouseUp:(e)=>{
			if(validateMouseUp(e)) {
				if (pressed) {
					setPressd(false);
				}
				if (onClick) {
					onClick(e);
				}
			} else {
				return;
			}
		},
		mouseLeave:(e)=>{
			if(validateMouseLeave(e)) {
				setPressd(false);
			}
		}
	}
	return <div 
		className={`genericButton fontMedium${className?' '+className:''}${pressed?' pressed':''}`}
		onMouseDown={handlePressed.mouseDown}
		onTouchStart={handlePressed.mouseDown}
		onMouseUp={handlePressed.mouseUp}
		onTouchEnd={handlePressed.mouseUp}
		onMouseLeave={handlePressed.mouseLeave}
		onTouchMove={handlePressed.mouseLeave}
		onContextMenu={(e)=>{e.preventDefault()}}
	>
		<div className="top">
			{children}
		</div>
		<div className={`bottom`}>

		</div>
	</div>
}