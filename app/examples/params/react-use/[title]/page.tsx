import React from 'react';

export default function ReactUseParamsPage(props: { params: Promise<{ title: string }> }) {
  const { title } = React.use(props.params);

  return (
    <div style={{ padding: 20 }}>
      <h1>React.use() Example (with params)</h1>
      <p>
        Title: <strong>{title}</strong>
      </p>
    </div>
  );
}

// http://localhost:3000/examples/params/react-use/world
