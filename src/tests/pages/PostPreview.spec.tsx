import { render, screen } from "@testing-library/react";
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { mocked } from "ts-jest/utils"

import { getPrismicClient } from '../../services/prismic'
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]'

jest.mock('next-auth/client')
jest.mock('next/router')
jest.mock('../../services/prismic')

const post = {
  slug: 'fake-post-slug',
  title: 'fake-post-title',
  content: '<p>fake-post-content</p>',
  updatedAt: 'fake-post-update',
}

describe('Post preview page', () => {
  it('should be able to render correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce([null, false])
    
    render(<Post post={post} />)

    expect(screen.getByText('fake-post-title')).toBeInTheDocument()
    expect(screen.getByText('fake-post-content')).toBeInTheDocument()
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument()
  })

  it('should be able to redirect if user is subscribed', async () => {
    const useSessionMocked = mocked(useSession)
    const useRouterMocked = mocked(useRouter)
    const pushMock = jest.fn()

    useSessionMocked.mockReturnValueOnce([
      { activeSubscription: 'fake-active-subscription' }, 
      false
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<Post post={post} />)

    expect(pushMock).toHaveBeenCalledWith('/posts/fake-post-slug')
  })

  it('should be able to load initial data', async () => {
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

    const response = await getStaticProps({ params: { slug: 'fake-post-slug' } })

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