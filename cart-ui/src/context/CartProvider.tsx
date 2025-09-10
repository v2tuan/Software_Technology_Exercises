import React, { createContext, useEffect, useReducer } from 'react'
import type { CartItem } from '../types';


type State = { items: CartItem[] }


type Action =
    | { type: 'ADD'; item: CartItem }
    | { type: 'REMOVE'; id: string }
    | { type: 'UPDATE_QTY'; id: string; qty: number }
    | { type: 'CLEAR' }


const initialState: State = { items: [] }


function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'ADD': {
            const exists = state.items.find(i => i.id === action.item.id)
            if (exists) {
                return {
                    items: state.items.map(i => i.id === action.item.id ? { ...i, qty: i.qty + action.item.qty } : i)
                }
            }
            return { items: [...state.items, action.item] }
        }
        case 'REMOVE':
            return { items: state.items.filter(i => i.id !== action.id) }
        case 'UPDATE_QTY':
            return { items: state.items.map(i => i.id === action.id ? { ...i, qty: action.qty } : i) }
        case 'CLEAR':
            return { items: [] }
        default:
            return state
    }
}


type CartContextType = {
    items: CartItem[],
    add: (item: CartItem) => void,
    remove: (id: string) => void,
    updateQty: (id: string, qty: number) => void,
    clear: () => void,
    total: () => number,
    count: () => number
}

const CartContext = createContext<CartContextType | null>(null)


export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState, (init) => {
        try { const raw = localStorage.getItem('cart'); return raw ? JSON.parse(raw) : init } catch { return init }
    })


    useEffect(() => {
        try { localStorage.setItem('cart', JSON.stringify(state)) } catch { /* ignore write errors */ }
    }, [state])


    const api = {
        items: state.items,
        add: (item: CartItem) => dispatch({ type: 'ADD', item }),
        remove: (id: string) => dispatch({ type: 'REMOVE', id }),
        updateQty: (id: string, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty }),
        clear: () => dispatch({ type: 'CLEAR' }),
        total: () => state.items.reduce((s, i) => s + i.price * i.qty, 0),
        count: () => state.items.reduce((s, i) => s + i.qty, 0)
    }


    return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export { CartContext }