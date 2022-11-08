import { ChangeEvent, useEffect, useState } from 'react';

type StyledRangeInputProps = {
	min: number;
	max: number;
	setValue: any;
};

const StyledRangeInput = (props: StyledRangeInputProps) => {
	const [inputValue, setInputValue] = useState<number>(0);

	useEffect(() => {
		props.setValue(inputValue);
	}, [inputValue]);

	const directInputOnChange = (event: ChangeEvent<HTMLInputElement>) => {
		const attempt = event.target.valueAsNumber;
		if (attempt > props.max) {
			setInputValue(props.max);
		} else {
			setInputValue(attempt);
		}
	};

	return (
		<div className='flex gap-2 w-full items-center'>
			<div className='text-grey font-light'>{props.min}</div>
			<input
				className='grow rounded-lg text-primary p-2.5 bg-background appearance-none'
				type='range'
				min={props.min}
				max={props.max}
				step={0.01}
				defaultValue={props.min}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.valueAsNumber)}
			/>
			<div className='text-grey font-light'>{props.max}</div>

			<input
				className='ml-4 w-32 px-3 appearance-none w-full bg-background py-1.5 rounded-lg focus:outline focus:outline-2 focus:outline-grey'
				type={'number'}
				value={inputValue}
				placeholder='0'
				onChange={directInputOnChange}
			/>
		</div>
	);
};

export default StyledRangeInput;
