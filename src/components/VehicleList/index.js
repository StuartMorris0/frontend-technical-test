import React, { useEffect, useRef, useState } from 'react';
import useData from './useData';
import './style.scss';

export const TABLET_BREAKPOINT_PX = 768;

export const findMediaUrl = (media, aspectRatio) => {
  const match = media.find((m) => m.url.includes(`/${aspectRatio}/`));
  return match ? match.url : media[0].url;
};

export default function VehicleList() {
  const [loading, error, vehicles, retry] = useData();
  const [openVehicle, setOpenVehicle] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    if (openVehicle && !dialog.open) {
      dialog.showModal();
    }

    if (!openVehicle) return undefined;

    const handleClose = () => setOpenVehicle(null);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [openVehicle]);

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) {
      closeDialog();
    }
  };

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
    <>
      <ul className="vehicle-list" data-testid="results">
        {vehicles.map((vehicle, index) => (
          <li
            key={vehicle.id}
            className="vehicle-list__item"
            style={{ '--card-index': index }}
          >
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
                  <button
                    type="button"
                    className="vehicle-card__name-button"
                    onClick={() => setOpenVehicle(vehicle)}
                  >
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
      {/* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- Escape and Close cover keyboard */}
      <dialog
        ref={dialogRef}
        className="vehicle-details"
        aria-labelledby="vehicle-details-title"
        onClick={handleBackdropClick}
      >
        {openVehicle && openVehicle.meta && (
          <div className="vehicle-details__content">
            <h2 id="vehicle-details-title" className="vehicle-details__title">
              {openVehicle.id.toUpperCase()}
            </h2>
            <dl className="vehicle-details__list">
              <div className="vehicle-details__row">
                <dt>Passengers</dt>
                <dd>{openVehicle.meta.passengers}</dd>
              </div>
              <div className="vehicle-details__row">
                <dt>Drivetrain</dt>
                <dd>{openVehicle.meta.drivetrain.join(', ')}</dd>
              </div>
              <div className="vehicle-details__row">
                <dt>Body style</dt>
                <dd>{openVehicle.meta.bodystyles.join(', ')}</dd>
              </div>
              <div className="vehicle-details__row">
                <dt>Emissions</dt>
                <dd>
                  {openVehicle.meta.emissions.value}
                  {' '}
                  g/km CO
                  <sub>2</sub>
                </dd>
              </div>
            </dl>
            <button
              type="button"
              className="vehicle-details__close"
              onClick={closeDialog}
            >
              Close
            </button>
          </div>
        )}
      </dialog>
    </>
  );
}
