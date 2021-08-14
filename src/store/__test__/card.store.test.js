import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import { orderBy } from 'lodash';

import axiosMock from '../../__mocks__/axios-mock';
import cardStore from '../card.store';

import { cardBuilder } from '../../__mocks__/card-builder';
import { cardStateBuilder } from '../../__mocks__/card-state-builder';

const setup = (state) => {
	jest.clearAllMocks();

    const defaultState = cardStateBuilder();
    const initialState = state || defaultState;

    const store = createStore(
        // reducers
        combineReducers({
            card: cardStore.reducer,
        }),
        // preloadState
        {
            card: initialState,
        },
        applyMiddleware(thunk)
    )

    return {
        initialState,
        store,
    }
}

describe('Card Store', () => {
    test('should have correct initial state', () => {
        const { initialState, store } = setup();

        // expect(store.getState()).toBe({ card: initialState });
        // o toBe se importa com as referências do objeto, por isso não passa, já o toEqual analisa apenas os valores
        expect(store.getState()).toEqual({ card: initialState });
    });

    test('should dispatch getCards', async () => {
        const card = cardBuilder();
        const { initialState, store } = setup();

        axiosMock.get.mockResolvedValueOnce({
            data: {
                cards: [card]
            }
        });

        await store.dispatch(cardStore.actions.getCards({ query: '' }));

        const currentState = store.getState();

        expect(axiosMock.get).toHaveBeenCalledTimes(1);
        expect(axiosMock.get).toHaveBeenCalledWith(`/cards?page=1&name=&pageSize=27`);
        expect(currentState.card).toEqual({
            ...initialState,
            cards: { [card.id]: card },
            ids: [card.id],
            query: '',
        });
    });

    test('should dispatch nextCards', async () => {
        const card = cardBuilder({ name: 'PokePicles' });
        const query = 'picles';
        const { initialState, store } = setup();

        store.dispatch(cardStore.actions.setQuery({ query }));

        axiosMock.get.mockResolvedValueOnce({
            data: {
                cards: [card]
            }
        });

        await store.dispatch(cardStore.actions.nextCards());

        const currentState = store.getState();

        expect(axiosMock.get).toHaveBeenCalledTimes(1);
        expect(axiosMock.get).toHaveBeenCalledWith(`/cards?page=2&name=${query}&pageSize=27`);
        expect(currentState.card).toEqual({
            ...initialState,
            query,
            page: 2,
            cards: { ...initialState.cards, [card.id]: card },
            ids: [...initialState.ids, card.id],
        });
    });

    test('should dispatch setQuery', () => {
        const query = 'picles';
        const { store } = setup();

        store.dispatch(cardStore.actions.setQuery({ query }));

        const currentState = store.getState();

        expect(currentState.card.query).toBe(query);
    });

    test('should dispatch setLoading', () => {
        const loading = true;
        const { store } = setup();

        store.dispatch(cardStore.actions.setLoading({ loading }));

        const currentState = store.getState();

        expect(currentState.card.loading).toBe(loading);
    });

    test('should dispatch setPage', () => {
        const page = 4;
        const { store } = setup();

        store.dispatch(cardStore.actions.setPage({ page }));

        const currentState = store.getState();

        expect(currentState.card.page).toBe(page);
    });

    test('should select cards', () => {
        const { initialState } = setup();

        const cards = cardStore.selectors.cards({ card: initialState });

        expect(cards).toEqual(
            orderBy(Object.values(initialState.cards), ['name'])
        );
    });

    test('should select loading', () => {
        const { initialState } = setup();

        const cards = cardStore.selectors.loading({ card: initialState });

        expect(cards).toEqual(initialState.loading);
    });
});
