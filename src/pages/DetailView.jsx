import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '../store';

export const DetailView = () => {
    const params = useParams();
    const { type, uid } = params;

    const [itemDetails, setItemDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { store, dispatch } = useGlobalReducer();

    const API_BASE_URL = "https://www.swapi.tech/api";

    const placeholderBaseUrl = `https://placehold.co/800x600/6c757d/dee2e6`;

    const formatKey = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
    };

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            setError(null);
            setItemDetails(null);
            try {
                const apiUrl = `${API_BASE_URL}/${type}/${uid}`;
                const response = await fetch(apiUrl);
                if (!response.ok) { throw new Error(`Fetch failed: ${response.status}`); }
                const data = await response.json();
                if (!data.result || !data.result.properties) { throw new Error(`Invalid data structure`); }
                setItemDetails(data.result.properties);
            } catch (err) {
                console.error("Error fetching details:", err);
                setError(err.message || 'Unknown error');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [type, uid]);

    const isFavorite = store.favorites.some(fav => fav.uid === uid && fav.type === type);
    const handleToggleFavorite = () => {
        if (!itemDetails) return;
        const favoritePayload = { uid: uid, type: type, name: itemDetails.name };
        if (isFavorite) { dispatch({ type: REMOVE_FAVORITE, payload: favoritePayload }); }
        else { dispatch({ type: ADD_FAVORITE, payload: favoritePayload }); }
    };

    if (loading) return <div className="container text-center mt-5"><div className="spinner-border text-warning" role="status" style={{ width: "4rem", height: "4rem" }}><span className="visually-hidden">Loading...</span></div><p className="mt-3 fs-4">Loading details...</p></div>;
    if (error) return <div className="container text-center mt-5"><div className="alert alert-danger" role="alert"><h4>Error Loading Details!</h4><p>{error}</p><Link to="/" className="btn btn-primary mt-2"><i className="fas fa-home me-2"></i> Back to Home</Link></div></div>;
    if (!itemDetails) return <div className="container text-center mt-5 alert alert-warning">No details could be loaded.<Link to="/" className="btn btn-primary ms-3">Back</Link></div>;

    const placeholderText = itemDetails.name;
    const placeholderImageUrl = `${placeholderBaseUrl}?text=${encodeURIComponent(placeholderText)}`;

    const excludedKeys = ['name', 'created', 'edited', 'url'];
    const propertiesToList = Object.entries(itemDetails).filter(
        ([key]) => !excludedKeys.includes(key) && itemDetails[key]
    );

    return (
        <div className="container my-5">
            <div className="row g-5">
                <div className="col-lg-6">
                    <img
                        src={placeholderImageUrl}
                        className="img-fluid rounded shadow-lg"
                        alt={`${itemDetails.name} (placeholder image)`}
                    />
                </div>
                <div className="col-lg-6">
                    <h1 className="display-4 text-warning mb-3">{itemDetails.name}</h1>
                    <p className="lead mb-4">
                        Detailed information about {itemDetails.name}.
                    </p>
                    <hr className="my-4 border-secondary" />
                    <h3 className="mb-3">Properties:</h3>
                    <dl className="row">
                        {propertiesToList.map(([key, value]) => (
                            <React.Fragment key={key}>
                                <dt className="col-sm-4 text-capitalize">{formatKey(key)}</dt>
                                <dd className="col-sm-8">{typeof value === 'object' ? JSON.stringify(value) : value}</dd>
                            </React.Fragment>
                        ))}
                    </dl>
                    <hr className="my-4 border-secondary" />
                    <div>
                        <Link to="/" className="btn btn-outline-primary me-3">
                            <i className="fas fa-arrow-left me-2"></i> Back to List
                        </Link>
                        <button
                            className={`btn ${isFavorite ? 'btn-warning' : 'btn-outline-warning'}`}
                            onClick={handleToggleFavorite}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            disabled={!itemDetails}
                        >
                            <i className={`fa-heart ${isFavorite ? 'fas text-danger' : 'far'}`}></i>
                            <span className="ms-2">{isFavorite ? 'Favorited!' : 'Add to Favorites'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};