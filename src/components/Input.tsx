import {useState} from 'react';
interface InputProps {
	label: string;
};
function Input<T extends InputProps>(props: T) {
	const [active, setActive] = useState(false);
	const onBlur = (event: any) => {
		event.preventDefault();
		if(event.target.value == "") setActive(false);
	}
	return (
		<div className={`form-field-container ${active ? "active" : ""}`}>
			<label>{props.label}</label>
			<input onBlur={onBlur} onFocus={() => setActive(true)} className="input" {...props}>
			</input>
		</div>
	);
}

export default Input;
