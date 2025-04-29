import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { REMOVE_FAVORITE } from "../store";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();

	const handleRemoveFavorite = (item) => {
		dispatch({ type: REMOVE_FAVORITE, payload: item });
	};

	const favoritesCount = store.favorites?.length || 0;

	return (
		<nav className="navbar navbar-light bg-light mb-3">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Star_Wars_Logo.svg/1280px-Star_Wars_Logo.svg.png" alt="Star Wars Logo" style={{ height: '40px', marginRight: '10px' }} />
						Blog
					</span>
				</Link>
				<div className="ms-auto">
					<div className="dropdown">
						<button
							className="btn btn-primary dropdown-toggle"
							type="button"
							id="favoritesDropdown"
							data-bs-toggle="dropdown"
							aria-expanded="false"
						>
							Favorites ({favoritesCount})
						</button>
						<ul className="dropdown-menu dropdown-menu-end" aria-labelledby="favoritesDropdown">
							{favoritesCount === 0 ? (
								<li><span className="dropdown-item text-muted">No favorites</span></li>
							) : (
								store.favorites.map((fav) => (
									<li key={`${fav.type}-${fav.uid}`} className="d-flex justify-content-between align-items-center px-2 py-1">
										<Link
											to={`/details/${fav.type}/${fav.uid}`}
											className="dropdown-item text-truncate"
											style={{
												flexGrow: 1, marginRight: '10px',
												textDecoration: 'none',
												color: 'inherit',
												paddingLeft: 0,
												paddingRight: 0
											}}
										>
											{fav.name}
										</Link>
										<button
											className="btn btn-sm btn-danger flex-shrink-0" 
											onClick={() => handleRemoveFavorite(fav)}
											aria-label={`Remove ${fav.name}`}
											title={`Remove ${fav.name}`}
										>
											<i className="fas fa-times"></i>
										</button>
									</li>
								))
							)}
						</ul>
					</div>
				</div>
			</div>
		</nav>
	);
};