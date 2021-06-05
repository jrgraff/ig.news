import Head from 'next/head'
import styles from './styles.module.scss'

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.postList}>
          <a href="#">
            <time>12 de abril de 2021</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build</p>
          </a>
          <a href="#">
            <time>12 de abril de 2021</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build</p>
          </a>
          <a href="#">
            <time>12 de abril de 2021</time>
            <strong>Creating a Monorepo with Lerna</strong>
            <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build</p>
          </a>
        </div>
      </main>
    </>
  )
}