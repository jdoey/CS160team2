import { render, fireEvent, waitFor } from '@testing-library/react';
import Map from '../components/Map';

// Mock the Google Maps API
jest.mock('@googlemaps/js-api-loader', () => ({
  Loader: jest.fn(() => ({
    importLibrary: jest.fn(async () => ({
      Map: jest.fn(),
      InfoWindow: jest.fn(),
      Marker: jest.fn(),
      places: {
        PlacesService: jest.fn(() => ({
          textSearch: jest.fn((_, callback) => {
            const results = [
              { geometry: { location: { lat: () => 37.334665328, lng: () => -121.875329832 } }, name: 'Chase ATM', formatted_address: '123 Main St' }
            ];
            callback(results, 'OK');
          })
        }))
      }
    }))
  }))
}));

describe('Map Component', () => {
  test('renders map and search form', async () => {
    const { getByText, getByPlaceholderText } = render(<Map />);

    // Check if the search form is rendered
    expect(getByPlaceholderText('Enter address or city name')).toBeInTheDocument();
    expect(getByText('Search')).toBeInTheDocument();
    expect(getByText('Use My Location')).toBeInTheDocument();

    // Mock user clicking on the "Search" button
    fireEvent.click(getByText('Search'));

    // Mock user clicking on the "Use My Location" button
    fireEvent.click(getByText('Use My Location'));

  });
});