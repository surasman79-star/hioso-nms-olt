import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Hioso NMS dashboard', () => {
  render(<App />);
  expect(screen.getByText(/Hioso NMS/i)).toBeInTheDocument();
  expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
});
