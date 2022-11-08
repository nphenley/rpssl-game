type StyledNumberInputProps = {
	placeholder: string;
	setValue: any;
};

const StyledNumberInput = (props: StyledNumberInputProps) => {
	return (
		<input
			className='appearance-none w-full bg-background p-3 rounded-lg focus:outline focus:outline-2 focus:outline-grey'
			type={'number'}
			placeholder={props.placeholder}
			onChange={(e) => props.setValue(e.target.valueAsNumber)}
		/>
	);
};

export default StyledNumberInput;
