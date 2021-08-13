import React from "react";
import {fireEvent, render} from "@testing-library/react";

import SearchBar from "../SearchBar";

const setup = (props) => {
	const defaultProps = {
		placeholder: 'Pesquise...',
		buttonLabel: 'Botão',
		inputDelay: 200,
		...props,	
	};
	const renderResult = render(<SearchBar {...defaultProps} />)

	return {
		inputElement: renderResult.getByPlaceholderText(defaultProps.placeholder),
		buttonElement: renderResult.getByText(defaultProps.buttonLabel),
		inputDelay: defaultProps.inputDelay,
		...renderResult,
	}
}

jest.useFakeTimers()

describe('SearchBar', () => {
	test('should render with default props', () => {
		const { inputElement, buttonElement } = setup();

		expect(buttonElement).toBeInTheDocument();
		expect(inputElement).toBeInTheDocument();
	});

	test('input should emit onChange event', () => {
		const onChange = jest.fn();
		const { inputElement, inputDelay } = setup({ onChange });

		fireEvent.change(inputElement, { target: { value: 'Picles' }});

        jest.advanceTimersByTime(inputDelay); // quanto tempo ele vai esperar

		expect(onChange).toHaveBeenCalledTimes(1);
		expect(onChange).toHaveBeenCalledWith({ target: inputElement });
	});

    test('button should emit onButtonClick event', () => {
        const onButtonClick = jest.fn();
        const { buttonElement } = setup({ onButtonClick });

        fireEvent.click(buttonElement);
        fireEvent.click(buttonElement);

        expect(onButtonClick).toHaveBeenCalledTimes(2);
    })
})