import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils"

import { stripe } from '../../services/stripe'
import Home from '../../pages'
import { getStaticProps } from "../../pages";

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')

describe('Homepage', () => {
  it('should be able to render correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 'fake-amount' }} />)

    expect(screen.getByText(/fake-amount/i)).toBeInTheDocument()
  })

  it('should be able to load the initial data', async () => {
    const retrieveStripePricesMocked = mocked(stripe.prices.retrieve)

    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )
  })
})