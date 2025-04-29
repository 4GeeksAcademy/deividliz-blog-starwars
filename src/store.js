export const initialStore = () => {
  return {
      favorites: []
  }
}

export const ADD_FAVORITE = 'ADD_FAVORITE';
export const REMOVE_FAVORITE = 'REMOVE_FAVORITE';

export default function storeReducer(store, action = {}) {
  switch (action.type) {
      case ADD_FAVORITE:
          // Comprueba si el favorito ya existe para no duplicarlo
          const exists = store.favorites.some(fav => fav.uid === action.payload.uid && fav.type === action.payload.type);
          if (exists) {
              return store; 
          }
          return {
              ...store,
              favorites: [...store.favorites, action.payload] 
          };

      case REMOVE_FAVORITE:
          return {
              ...store,
              favorites: store.favorites.filter(fav => !(fav.uid === action.payload.uid && fav.type === action.payload.type))
          };

      default:
          return store;
  }
}