// app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import styles from '../styles/Home.module.css'; // Create this file for styling

export default function Home() {
  return (
    <main className={styles.container}>
      <Image
        src="/images/Reverie-Logo-White-shadow.png"
        alt="Reverie Logo"
        className={styles.logo}
        width={400}
        height={200}
      />
      <div className={styles.buttons}>
      
        <div className={styles.buttons}>
        <Link href="./game" className={styles.button}>
            New Game
          </Link>
          <Link href="./how-to-play" className={styles.button}>
            How to Play
          </Link>
          <Link href="/about" className={styles.button}>
            About
          </Link>
         </div>
      </div>
    </main>
  );
}
