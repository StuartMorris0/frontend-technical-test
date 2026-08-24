import React from 'react';
import useData from './useData';
import './style.scss';

export default function VehicleList() {
  const [loading, error, vehicles, retry] = useData();

  if (loading) {
    return <div data-testid="loading" role="status">Loading</div>;
  }

  if (error) {
    return (
      <div data-testid="error" role="alert">
        <h2>Something went wrong</h2>
        <p>Please check your connection and try again.</p>
        <button type="button" onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  if (!vehicles.length) {
    return <div data-testid="empty" role="status">No vehicles available right now.</div>;
  }

  return (
    <div data-testid="results">
      <p>List of vehicles will be displayed here</p>
    </div>
  );
}
