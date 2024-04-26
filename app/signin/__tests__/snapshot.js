import { render } from '@testing-library/react'
import Page from '../page.tsx'

jest.mock("next/navigation", () => ({
    useRouter() {
      return {
        prefetch: () => null
      };
    }
  }));

it('No changes in employee-signin Page', () => {
    const { container } = render(<Page />);
    expect(container).toMatchSnapshot();
});