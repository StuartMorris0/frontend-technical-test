import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VehicleList, { findMediaUrl } from '..';
import useData from '../useData';

jest.mock('../useData');

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
    expect(getByText('From £30,000')).not.toBeNull();
    expect(getByText(/most advanced, efficient and refined/i)).not.toBeNull();
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
});
