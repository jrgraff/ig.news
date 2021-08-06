import { render, screen } from "@testing-library/react";
import { getSession } from 'next-auth/client'
import { mocked } from "ts-jest/utils"

import { getPrismicClient } from '../../services/prismic'
import Post, { getServerSideProps } from '../../pages/posts/[slug]'

jest.mock('next-auth/client')
jest.mock('../../services/prismic')

const post = {
  slug: 'fake-post-slug',
  title: 'fake-post-title',
  content: '<p>fake-post-content</p>',
  updatedAt: 'fake-post-update',
}

describe('Posts page', () => {
  it('should be able to render correctly', () => {
    render(<Post post={post} />)

    expect(screen.getByText('fake-post-title')).toBeInTheDocument()
    expect(screen.getByText('fake-post-content')).toBeInTheDocument()
  })

  it('should be able to redirect if subscription not valid', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: {
        slug: 'fake-post-slug',
      }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/fake-post-slug'
        })
      })
    )
  })

  it('should be able to load initial data', async () => {
    const getSessionMocked = mocked(getSession)
    const getPrismicMocked = mocked(getPrismicClient)

    getPrismicMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: 'heading', text: 'fake-post-title' }],
          content: [{ type: 'paragraph', text: 'fake-post-content' }]
        },
        last_publication_date: '04-01-2021'
      })
    } as any)

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    })

    const response = await getServerSideProps({
      params: { slug: 'fake-post-slug' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'fake-post-slug',
            title: 'fake-post-title',
            content: '<p>fake-post-content</p>',
            updatedAt: '01 de abril de 2021'
          }
        }
      })
    )
  })
})