import React, { useState, useEffect, useRef } from 'react';
import ItemCard from '../components/ItemCard';

export const Home = () => {
    const [people, setPeople] = useState([]);
    const [planets, setPlanets] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRan = useRef(false);

    const API_BASE_URL = "https://www.swapi.tech/api";

    useEffect(() => {
        if (!fetchRan.current) {
            const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                    const [peopleRes, planetsRes, vehiclesRes] = await Promise.all([
                        fetch(`${API_BASE_URL}/people/`),
                        fetch(`${API_BASE_URL}/planets/`),
                        fetch(`${API_BASE_URL}/vehicles/`)
                    ]);

                    if (!peopleRes.ok || !planetsRes.ok || !vehiclesRes.ok) {
                        if (peopleRes.status === 429 || planetsRes.status === 429 || vehiclesRes.status === 429) {
                            throw new Error('API rate limit exceeded (429 Too Many Requests). Please wait a moment and reload.');
                        }
                        throw new Error('Failed to fetch data from SWAPI.tech (check network status)');
                    }

                    const peopleData = await peopleRes.json();
                    const planetsData = await planetsRes.json();
                    const vehiclesData = await vehiclesRes.json();

                    setPeople(peopleData.results || []);
                    setPlanets(planetsData.results || []);
                    setVehicles(vehiclesData.results || []);

                } catch (err) {
                    console.error("Error fetching SWAPI data:", err);
                    setError(err.message || 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
            fetchRan.current = true;
        }
    }, []);

    return (
        <div className="container mt-5">
            {loading && (
                <div className="container text-center mt-5">
                    <div className="spinner-border text-warning" role="status" style={{ width: "4rem", height: "4rem" }}>
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 fs-4">Loading data...</p>
                </div>
            )}
            {error && !loading && (
                <div className="container text-center mt-5">
                    <div className="alert alert-danger" role="alert">
                        <h4>Error fetching data!</h4>
                        <p>{error}</p>
                    </div>
                </div>
            )}
            {!loading && !error && (
                <>
                    <h2 className="text-danger mb-3">Characters</h2>
                    <div className="d-flex flex-row flex-nowrap overflow-auto pb-4">
                        {people.map(person => (
                            <div key={`people-${person.uid}`} className="me-4 h-100">
                                <ItemCard item={person} type="people" />
                            </div>
                        ))}
                    </div>
                    <h2 className="text-danger mt-5 mb-3">Planets</h2>
                    <div className="d-flex flex-row flex-nowrap overflow-auto pb-4">
                        {planets.map(planet => (
                            <div key={`planets-${planet.uid}`} className="me-4 h-100">
                                <ItemCard item={planet} type="planets" />
                            </div>
                        ))}
                    </div>
                    <h2 className="text-danger mt-5 mb-3">Vehicles</h2>
                    <div className="d-flex flex-row flex-nowrap overflow-auto pb-4">
                        {vehicles.map(vehicle => (
                            <div key={`vehicles-${vehicle.uid}`} className="me-4 h-100">
                                <ItemCard item={vehicle} type="vehicles" />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};