import React from 'react';
import useData from './useData';
import './style.scss';

export const TABLET_BREAKPOINT_PX = 768;

export const findMediaUrl = (media, aspectRatio) => {
  const match = media.find((m) => m.url.includes(`/${aspectRatio}/`));
  return match ? match.url : media[0].url;
};

export default function VehicleList() {
  const [loading, error, vehicles, retry] = useData();

  if (loading) {
    return <div data-testid="loading" role="status">Loading</div>;
  }

  if (error) {
    return (
      <div data-testid="error" role="alert" className="vehicle-list__error">
        <h2 className="vehicle-list__error-title">Something went wrong</h2>
        <p className="vehicle-list__error-message">Please check your connection and try again.</p>
        <button type="button" className="vehicle-list__retry" onClick={retry}>
          Try again
        </button>
      </div>
    );
  }

  if (!vehicles.length) {
    return <div data-testid="empty" role="status">No vehicles available right now.</div>;
  }

  return (
    <ul className="vehicle-list" data-testid="results">
      {vehicles.map((vehicle) => (
        <li key={vehicle.id} className="vehicle-list__item">
          <article className="vehicle-card">
            <picture className="vehicle-card__picture">
              <source
                media={`(min-width: ${TABLET_BREAKPOINT_PX}px)`}
                srcSet={findMediaUrl(vehicle.media, '16x9')}
              />
              <img
                src={findMediaUrl(vehicle.media, '1x1')}
                className="vehicle-card__image"
                alt=""
              />
            </picture>
            <div className="vehicle-card__body">
              <h2 className="vehicle-card__name">
                <button type="button" className="vehicle-card__name-button">
                  {vehicle.id.toUpperCase()}
                </button>
              </h2>
              <p className="vehicle-card__price">{`From ${vehicle.price}`}</p>
              <p className="vehicle-card__description">{vehicle.description}</p>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
