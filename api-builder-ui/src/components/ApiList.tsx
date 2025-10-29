interface ApiListProps {
  apis: any[];
}

export default function ApiList({ apis }: ApiListProps) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        marginTop: 10,
      }}
    >
      <thead>
        <tr>
          <th style={thStyle}>Method</th>
          <th style={thStyle}>Path</th>
          <th style={thStyle}>Type</th>
          <th style={thStyle}>Query</th>
        </tr>
      </thead>
      <tbody>
        {apis.map((api) => (
          <tr key={api.id}>
            <td style={tdStyle}>{api.method}</td>
            <td style={tdStyle}>{api.path}</td>
            <td style={tdStyle}>{api.type}</td>
            <td style={tdStyle}>{api.query}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const thStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 8,
  backgroundColor: "#f2f2f2",
  textAlign: "left",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #ddd",
  padding: 8,
};
