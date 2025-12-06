import Link from 'next/link';

export default function ExamplesIndexPage() {
  const examples = [
    { title: 'Params with Async/Await', link: '/examples/params/async/Hello' },
    { title: 'Params with React.use()', link: '/examples/params/react-use/World' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, marginBottom: 20 }}>Examples</h1>

      <ul style={{ lineHeight: '2rem' }}>
        {examples.map((item) => (
          <li key={item.link}>
            <Link href={item.link} style={{ color: 'blue' }}>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
