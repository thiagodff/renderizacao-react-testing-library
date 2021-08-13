import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import PokemonCard from '../PokemonCard';
import { cardBuilder } from '../../../__mocks__/card-builder';

const setup = (props = {
	card: cardBuilder({ name: 'MeuPokemon' })
}) => {
	const { card } = props;
	const imageAlt = `${card.id}-${card.name}`;
	// const onClick = jest.fn(() => { podemos fazer algo quando o evento é emitido });
	const onClick = jest.fn();
	const renderResult = render(<PokemonCard {...card} onClick={onClick} />);
	const imageElement = renderResult.getByAltText(imageAlt);

	return {
		card,
		imageAlt,
		imageElement,
		onClick,
		...renderResult,
	}
}

describe('PokemonCard', () => {
	test('should render with default props', () => {
		const { card, imageAlt, imageElement } = setup();
		
		expect(imageElement).toBeInTheDocument();
		expect(imageElement.src).toBe(card.imageUrl);
		expect(imageElement.alt).toBe(imageAlt);
	});
	
	test('should emit event onClick', () => {
		const { onClick, imageElement } = setup();
		// fireEvent.click(imageElement);
		imageElement.click();

		expect(onClick).toHaveBeenCalledTimes(1);
	})
})