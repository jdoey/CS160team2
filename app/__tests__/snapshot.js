import {render} from '@testing-library/react'
import Page from '../page'

it('No changes in Landing Page', () => {
    const { container } = render(<Page />)
  expect(container).toMatchSnapshot()
})