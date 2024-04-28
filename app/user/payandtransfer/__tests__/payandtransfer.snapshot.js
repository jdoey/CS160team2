import {render} from '@testing-library/react'
import Page from '../page'

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ accounts: [], isSuccess: true }),
    ok: true,
  })
);

it('renders user/payandtransfer renders correctly', () => {
    
    const {container} = render(<Page />)
    expect(container).toMatchSnapshot()
})