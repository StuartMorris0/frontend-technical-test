import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import VehicleList from '..';
import useData from '../useData';

jest.mock('../useData');

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
    useData.mockReturnValue([false, false, 'results']);
    const { queryByTestId } = render(<VehicleList />);

    expect(queryByTestId('loading')).toBeNull();
    expect(queryByTestId('error')).toBeNull();
    expect(queryByTestId('results')).not.toBeNull();
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
