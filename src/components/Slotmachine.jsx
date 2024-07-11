import { useState } from "react";
import * as Defaults from '/src/datas/Defaults'
import { SlotmachineDisplayContainer } from "./SlotmachineDisplay";

function Slotmachine() {
	const [displayString,setDisplayString] = useState('');
	const handleDisplayString = (val)=>{
		setDisplayString(val);
	}
	return <>
		<SlotmachineDisplayContainer handleDisplayString={handleDisplayString} items={Defaults.items}/>
	</>
}

export {
	Slotmachine
}