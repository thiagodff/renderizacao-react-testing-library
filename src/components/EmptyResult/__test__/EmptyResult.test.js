import React from 'react';
import { render } from '@testing-library/react';

import EmptyResult from '../EmptyResult';

describe('EmptyResult', () => {
	test('should render with default props', () => {
		const { container, getByText, getByAltText } = render(<EmptyResult />);
		const defaultMessage = 'Oops... Não encontramos nada.';

		const image = getByAltText(/empty result/i);

		expect(container).toBeInTheDocument();
		expect(getByText(defaultMessage)).toBeInTheDocument();
		expect(image).toBeInTheDocument();
	});

	test('should render with custom message', () => {
		const customMessage = 'Custom message.';

		const { getByText } = render(<EmptyResult message={customMessage} />);
		expect(getByText(customMessage)).toBeInTheDocument();
	});

	test('image should have correct width', () => {
		const defaultWidth = 200;
		const newWidth = 300;

		const { getByAltText, rerender } = render(<EmptyResult />);
		const image = getByAltText(/empty result/i);

		expect(image.width).toBe(defaultWidth);
		rerender(<EmptyResult width={newWidth} />)
		
		expect(image.width).toBe(newWidth);
	});
})