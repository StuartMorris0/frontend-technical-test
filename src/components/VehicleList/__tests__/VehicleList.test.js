import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import VehicleList, { findMediaUrl } from '..';
import useData from '../useData';

expect.extend(toHaveNoViolations);

jest.mock('../useData');

if (typeof HTMLDialogElement !== 'undefined' && !HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function close() {
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

const xe = {
  id: 'xe',
  apiUrl: '/api/vehicle_xe.json',
  media: [
    { name: 'vehicle', url: '/images/16x9/xe_k17.jpg' },
    { name: 'vehicle', url: '/images/1x1/xe_k17.jpg' },
  ],
  price: '£30,000',
  description: 'The most advanced, efficient and refined sports saloon that Jaguar has ever produced.',
  meta: {
    passengers: 5,
    drivetrain: ['AWD', 'RWD'],
    bodystyles: ['saloon'],
    emissions: { value: 99 },
  },
};

describe('<VehicleList /> Tests', () => {
  it('Should show loading state if it not falsy', () => {
    useData.mockReturnValue([true, 'An error occurred', 'results']);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).not.toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  it('Should show error if it is not falsy and loading is finished', () => {
    useData.mockReturnValue([false, 'An error occurred', 'results']);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).not.toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  it('Should show results if loading successfully finished', () => {
    useData.mockReturnValue([false, false, [xe]]);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).not.toBeNull();
  });

  it('Should render the vehicle name, price, and description', () => {
    useData.mockReturnValue([false, false, [xe]]);
    const { getByRole, getByText } = render(<VehicleList />);

    expect(getByRole('button', { name: /^xe$/i })).not.toBeNull();
    expect(getByText(/from/i)).not.toBeNull();
    expect(getByText('£30,000')).not.toBeNull();
    expect(getByText(/most advanced, efficient and refined/i)).not.toBeNull();
  });

  it('Should expose a keyboard-focusable card button for each vehicle', () => {
    useData.mockReturnValue([false, false, [xe]]);
    const { getByRole } = render(<VehicleList />);
    const button = getByRole('button', { name: /^xe$/i });

    expect(button.getAttribute('type')).toBe('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('Should show empty state when the vehicles array is empty', () => {
    useData.mockReturnValue([false, false, []]);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('empty')).not.toBeNull();
    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).toBeNull();
  });

  it('Should invoke retry when the error-state button is clicked', () => {
    const retry = jest.fn();
    useData.mockReturnValue([false, 'An error occurred', [], retry]);
    const { getByRole } = render(<VehicleList />);

    fireEvent.click(getByRole('button', { name: /try again/i }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  it('Should reopen the modal after closing the same card', () => {
    useData.mockReturnValue([false, false, [xe]]);

    const { container, queryByText, getByRole } = render(<VehicleList />);
    const heading = getByRole('button', { name: /^xe$/i });
    const dialog = container.querySelector('.vehicle-details');

    fireEvent.click(heading);
    expect(dialog.open).toBe(true);
    expect(queryByText(/passengers/i)).not.toBeNull();

    fireEvent.click(container.querySelector('.vehicle-details__close'));
    expect(dialog.open).toBe(false);

    fireEvent.click(heading);
    expect(dialog.open).toBe(true);
    expect(queryByText(/passengers/i)).not.toBeNull();
  });

  it('Should clear modal content when the dialog close event fires', () => {
    // Real Escape dismissal is browser-native; jsdom does not fire it from keyDown.
    useData.mockReturnValue([false, false, [xe]]);
    const { container, getByRole, queryByText } = render(<VehicleList />);
    const dialog = container.querySelector('.vehicle-details');

    fireEvent.click(getByRole('button', { name: /^xe$/i }));
    expect(dialog.open).toBe(true);
    expect(queryByText(/passengers/i)).not.toBeNull();

    act(() => {
      dialog.dispatchEvent(new Event('close'));
    });
    expect(queryByText(/passengers/i)).toBeNull();
  });

  it('Should close the modal when the backdrop is clicked', () => {
    useData.mockReturnValue([false, false, [xe]]);
    const { container, getByRole } = render(<VehicleList />);
    const dialog = container.querySelector('.vehicle-details');

    fireEvent.click(getByRole('button', { name: /^xe$/i }));
    expect(dialog.open).toBe(true);

    act(() => {
      fireEvent.click(dialog);
    });
    expect(dialog.open).toBe(false);
  });

  it('Should not open the modal when the vehicle has no meta', () => {
    const noMeta = { ...xe, meta: undefined };
    useData.mockReturnValue([false, false, [noMeta]]);
    const { container, getByRole } = render(<VehicleList />);
    const dialog = container.querySelector('.vehicle-details');

    fireEvent.click(getByRole('button', { name: /^xe$/i }));
    expect(dialog.open).toBe(false);
  });

  it('Should render the dialog shell when meta fields are incomplete', () => {
    const partialMeta = {
      ...xe,
      meta: { passengers: 5 },
    };
    useData.mockReturnValue([false, false, [partialMeta]]);
    const { container, getByRole } = render(<VehicleList />);
    const dialog = container.querySelector('.vehicle-details');

    fireEvent.click(getByRole('button', { name: /^xe$/i }));
    expect(dialog.open).toBe(true);
    expect(dialog.querySelector('#vehicle-details-title')).not.toBeNull();
    expect(getByRole('button', { name: /close/i })).not.toBeNull();
  });

  it('Should have no axe violations on the list, empty, error, loading, and open modal', async () => {
    useData.mockReturnValue([true, false, []]);
    const loading = render(<VehicleList />);
    expect(await axe(loading.container)).toHaveNoViolations();
    loading.unmount();

    useData.mockReturnValue([false, true, [], jest.fn()]);
    const errored = render(<VehicleList />);
    expect(await axe(errored.container)).toHaveNoViolations();
    errored.unmount();

    useData.mockReturnValue([false, false, []]);
    const empty = render(<VehicleList />);
    expect(await axe(empty.container)).toHaveNoViolations();
    empty.unmount();

    useData.mockReturnValue([false, false, [xe]]);
    const list = render(<VehicleList />);
    expect(await axe(list.container)).toHaveNoViolations();

    fireEvent.click(list.getByRole('button', { name: /^xe$/i }));
    expect(await axe(list.container)).toHaveNoViolations();
  });
});

describe('findMediaUrl helper', () => {
  const bothVariants = [
    { name: 'vehicle', url: '/images/16x9/xe_k17.jpg' },
    { name: 'vehicle', url: '/images/1x1/xe_k17.jpg' },
  ];

  it('Should return the matching aspect-ratio URL', () => {
    expect(findMediaUrl(bothVariants, '1x1')).toBe('/images/1x1/xe_k17.jpg');
    expect(findMediaUrl(bothVariants, '16x9')).toBe('/images/16x9/xe_k17.jpg');
  });

  it('Should fall back to the first media entry when no aspect ratio matches', () => {
    const singleVariant = [{ name: 'vehicle', url: '/images/16x9/xe_k17.jpg' }];
    expect(findMediaUrl(singleVariant, '1x1')).toBe('/images/16x9/xe_k17.jpg');
  });

  it('Should return an empty string when media is missing or empty', () => {
    expect(findMediaUrl(undefined, '1x1')).toBe('');
    expect(findMediaUrl(null, '16x9')).toBe('');
    expect(findMediaUrl([], '1x1')).toBe('');
  });
});
