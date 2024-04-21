import { render } from '@testing-library/react'
import Navbar from '../components/AtmNavbar.tsx'


    test('renders navbar with logo and navigation links', () => {
        const { getByText, getByRole } = render(<Navbar />);

    // Check if the logo is rendered
    const mazeBankLogo = getByRole('img', { name: 'Maze Bank Logo' });
    expect(mazeBankLogo).toBeInTheDocument();

    // Check if navigation links are rendered
    const signInLink = getByText('Sign In');
    expect(signInLink).toBeInTheDocument();

    const enrollLink = getByText('Enroll');
    expect(enrollLink).toBeInTheDocument();

    // Check if navigation buttons have correct href attributes
    expect(signInLink).toHaveAttribute('href', '/signin');
    expect(enrollLink).toHaveAttribute('href', '/enroll');
  });

