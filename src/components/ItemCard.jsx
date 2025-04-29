import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer'; 
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../store'; 

const ItemCard = ({ item, type }) => {
    const { store, dispatch } = useGlobalReducer();

    const placeholderImageUrl = `https://placehold.co/400x200/6c757d/dee2e6?text=${type}+${item.uid}`;
    const isFavorite = store.favorites.some(fav => fav.uid === item.uid && fav.type === type);
    const handleToggleFavorite = () => {
        const favoritePayload = { uid: item.uid, type: type, name: item.name };
        if (isFavorite) { dispatch({ type: REMOVE_FAVORITE, payload: favoritePayload }); }
        else { dispatch({ type: ADD_FAVORITE, payload: favoritePayload }); }
    };

    return (
        <div className="card border-dark h-100" style={{ minWidth: '18rem', maxWidth: '18rem' }}>
            <img
                src={placeholderImageUrl}
                className="card-img-top"
                alt={`${item.name} (placeholder image)`} 
                style={{ height: '200px', objectFit: 'contain', backgroundColor: '#f8f9fa' }} 
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{item.name}</h5>
                <div className="mt-auto d-flex justify-content-between align-items-center pt-3">
                    <Link to={`/details/${type}/${item.uid}`} className="btn btn-outline-primary">
                        Learn More!
                    </Link>
                    <button
                        className={`btn ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                        onClick={handleToggleFavorite}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <i className={`fa-heart ${isFavorite ? 'fas text-danger' : 'far'}`}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

ItemCard.propTypes = {
    item: PropTypes.shape({
        uid: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    type: PropTypes.oneOf(['people', 'planets', 'vehicles']).isRequired,
};

export default ItemCard;