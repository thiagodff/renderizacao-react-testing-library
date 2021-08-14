import React from "react";
import { fireEvent, getByAltText, render, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { MemoryRouter, Route } from "react-router-dom";
import thunk from "redux-thunk";

import axiosMock from '../../__mocks__/axios-mock';

import DeckAddView from "../DeckAddView";
import cardStore from "../../store/card.store";
import deckStore from "../../store/deck.store";
import { pikachuMock, squirtleMock } from "../../__mocks__/card-builder";
import { storeBuilder } from "../../__mocks__/store-builder";

jest.useFakeTimers();

const setup = () => {
	jest.clearAllMocks(); // como o axios está mockado precisamos sempre limpar
    
    const store = storeBuilder();

    const renderResult = render(
        <Provider store={store}>
            <MemoryRouter>
                <Route path={'/'} component={DeckAddView}></Route>
            </MemoryRouter>
        </Provider>
    );

    return {
		...renderResult,
        store,
        input: renderResult.getByPlaceholderText('Pesquise...'),
        btnAdd: renderResult.getByText('Salvar Baralho'),
	};
}

describe('DeckAddView', () => {
    const mockCardsResponse = (cards = []) => {
        axiosMock.get.mockResolvedValue({
            data: {
                cards,
            }
        });
    };

    test('should render with default props', async () => {
        mockCardsResponse();

        const { container, input, btnAdd, getByAltText } = setup();

        // o waitFor executa a função definida como callback a cada X ms definido
        // caso não passado esse valor esse verifica em um tempo default
        await waitFor(() => {
            expect(getByAltText('Empty Result'));
        });

        expect(container).toBeInTheDocument();
        expect(input).toBeInTheDocument();
        expect(btnAdd).toBeInTheDocument();
    });

    test('should render loading', () => {
        mockCardsResponse();

        const { getByAltText, store } = setup();

        store.dispatch(cardStore.actions.setLoading({ loading: true }));

        expect(getByAltText('Pokeball Loading')).toBeInTheDocument();
    });

    test('should search', async () => {
        mockCardsResponse();

        const query = 'picles';
        const { input } = setup();

        // também poderia ser utilizar o user event para simular a digitação do usuário
        fireEvent.change(input, { target: { value: query }});

        // como os timers estão mockados pelo useFakeTimers nós podemos rodar todos os pendentes sem precisar esperá-los concluir
        jest.runAllTimers();

        expect(axiosMock.get).toHaveBeenCalledTimes(2);
        expect(axiosMock.get).toHaveBeenCalledWith(`/cards?page=1&name=${query}&pageSize=27`);
    });

    test('should render cards', async () => {
        const cards = [pikachuMock, squirtleMock];

        mockCardsResponse(cards);

        const { getByAltText } = setup();

        await waitFor(() => {
            cards.forEach(card => {
                expect(getByAltText(`${card.id}-${card.name}`)).toBeInTheDocument();
            })
        });
    });
})