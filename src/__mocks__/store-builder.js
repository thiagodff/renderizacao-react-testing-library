import { applyMiddleware, combineReducers, createStore } from 'redux';
import thunk from 'redux-thunk';
import cardStore from '../store/card.store';
import deckStore from '../store/deck.store';

export const storeBuilder = (initialState) => {
	return createStore(
        combineReducers({
            card: cardStore.reducer,
            deck: deckStore.reducer,
        }),
        initialState,
        applyMiddleware(thunk),
    );
}