export default async function AsyncParamsPage(props: { params: Promise<{ title: string }> }) {
  const { title } = await props.params;

  return (
    <div style={{ padding: 20 }}>
      <h1>Async/Await Example (with params)</h1>
      <p>
        Title: <strong>{title}</strong>
      </p>
    </div>
  );
}

// http://localhost:3000/examples/params/async/hello
