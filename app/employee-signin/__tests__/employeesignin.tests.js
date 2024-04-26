import { render, fireEvent } from '@testing-library/react';
import LoginCard from '../components/LoginCard';

describe('LoginCard Component', () => {
  test('submits form with typed values', () => {
    const { getByLabelText, getByText } = render(<LoginCard />);
    
    const usernameInput = getByLabelText('Username');
    const passwordInput = getByLabelText('Password');
    
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    fireEvent.click(getByText('Sign in'));

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });
});