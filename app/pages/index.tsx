import Link from "next/link";

function HomePage(): JSX.Element {
  return (
    <header>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li>
            <Link href="/login">Login</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default HomePage;
