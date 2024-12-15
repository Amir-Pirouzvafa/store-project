import { createContext, useContext, useReducer } from "react";
import { sumProducts } from "../helper/helper";

const CartContext = createContext();

const initialState = {
  selectedItem: [],
  itemCounter: 0,
  total: 0,
  checkout: false,
};

const reducer = (state, action) => {
  console.log(action);
  switch (action.type) {
    case "ADD_ITEM":
      if (!state.selectedItem.find((item) => item.id === action.payload.id)) {
        state.selectedItem.push({ ...action.payload, quantity: 1 });
      }
      return {
        ...state,
        ...sumProducts(state.selectedItem),
        checkout: false,
      };
    case "REMOVE_ITEM":
      const newSelectedItems = state.selectedItem.filter(
        (item) => item.id !== action.payload.id
      );
      return {
        ...state,
        selectedItem: [...newSelectedItems],
        ...sumProducts(newSelectedItems),
      };
    case "INCREASE":
      const increaseIndex = state.selectedItem.findIndex(
        (item) => item.id === action.payload.id
      );
      state.selectedItem[increaseIndex].quantity++;
      return {
        ...state,
        ...sumProducts(state.selectedItem),
      };
    case "DECREASE":
      const decreaseIndex = state.selectedItem.findIndex(
        (item) => item.id === action.payload.id
      );
      state.selectedItem[decreaseIndex].quantity--;
      return {
        ...state,
        ...sumProducts(state.selectedItem),
      };
    case "CHECKOUT":
      return {
        selectedItem: [],
        itemCounter: 0,
        total: 0,
        checkout: true, 
      };
    default:
      throw new Error("Invalid Action");
  }
};

function CartProvider({ children }) {
  const [state, dispath] = useReducer(reducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispath }}>
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const { state, dispath } = useContext(CartContext);
  return [state, dispath];
};

export default CartProvider;
export { useCart };
