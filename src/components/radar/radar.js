import React, { useMemo } from 'react';
import './radar.css';
import { useWeather } from '../../context/WeatherContext';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';

const Radar = () => {
    "use memo"; // Enable React Compiler optimization
    
    const { coordinates } = useWeather();
    
    // Calculate adjusted coordinates once when data changes
    const adjustedCoordinates = useMemo(() => {
        if (!coordinates.latitude || !coordinates.longitude) {
            return null;
        }
        const adjustedLatitude = coordinates.latitude - 0.05;
        const adjustedLongitude = coordinates.longitude - 0.011;
        return { lat: adjustedLatitude, lon: adjustedLongitude };
    }, [coordinates.latitude, coordinates.longitude]);
    
    // Build the iframe URL once when coordinates change
    const iframeUrl = useMemo(() => {
        if (!adjustedCoordinates) {
            return '';
        }
        const { lat, lon } = adjustedCoordinates;
        return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=650&height=750&zoom=9&level=surface&overlay=rain&product=ecmwf&menu=&message=true&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=%C2%B0F&radarRange=-1`;
    }, [adjustedCoordinates]);
    
    // Early return if no data is available
    if (!adjustedCoordinates) {
        return (
            <LoadingSpinner
                size="medium"
                message="Loading radar..."
                className="radar-loading"
            />
        );
    }
    
    return (
        <div className="radar container-fluid">
            <h5 className="radar_text">Current Radar:</h5>
            <iframe
                title="Weather Radar"
                id="radar"
                src={iframeUrl}
                frameBorder="0"
                loading="lazy"
                aria-label="Interactive weather radar map"
            ></iframe>
        </div>
    );
};

// Wrap with ErrorBoundary for better error handling
const RadarWithErrorBoundary = () => (
    <ErrorBoundary fallback={<div className="error-container"><h3>Unable to load radar</h3></div>}>
        <Radar />
    </ErrorBoundary>
);

export default RadarWithErrorBoundary;
