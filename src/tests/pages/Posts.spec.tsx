import { render, screen } from "@testing-library/react";
import { mocked } from "ts-jest/utils"

import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'

jest.mock('../../services/prismic')

const posts = [{
  slug: 'fake-post-slug',
  title: 'fake-post-title',
  excerpt: 'fake-post-excerpt',
  updatedAt: 'fake-post-update',
}]

describe('Posts page', () => {
  it('should be able to render correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('fake-post-title')).toBeInTheDocument()
  })

  it('should be able to load the initial data', async () => {
    const getPrismicMocked = mocked(getPrismicClient)

    getPrismicMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: 'fake-post-slug',
            data: {
              title: [{ type: 'heading', text: 'fake-post-title' }],
              content: [{ type: 'paragraph', text: 'fake-post-excerpt' }]
            },
            last_publication_date: '04-01-2021'
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'fake-post-slug',
            title: 'fake-post-title',
            excerpt: 'fake-post-excerpt',
            updatedAt: '01 de abril de 2021'
          }]
        }
      })
    )
  })
})