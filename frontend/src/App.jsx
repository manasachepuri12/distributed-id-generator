import { useState } from "react";
import "./App.css";

function App() {
  const [idDetails, setIdDetails] = useState(null);
const [history, setHistory] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
  const generateId = async () => {
  setLoading(true);
  setError("");

  try {
   const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const response = await fetch(
  `${API_BASE_URL}/api/id`
);
    if (!response.ok) {
      throw new Error("Failed to generate ID");
    }

    const data = await response.json();

    setIdDetails(data);

    setHistory((previous) => [
      data,
      ...previous
    ]);

  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
const totalGenerated = history.length;

const uniqueIds = new Set(
  history.map((item) => item.id)
).size;

const duplicates = totalGenerated - uniqueIds;
  return (
    <div className="app">

      {/* Header */}
      <header className="header">

        <div>
          <h1>Distributed ID Generator</h1>
          <p>
            Snowflake-style Unique ID Generation System
          </p>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>

      </header>


      {/* Main Dashboard */}
      <main className="dashboard">

        {/* Statistics */}
        <section className="stats-grid">

          <div className="stat-card">
            <h3>Total IDs Generated</h3>
            <p>{totalGenerated}</p>
          </div>

          <div className="stat-card">
  <h3>Unique IDs</h3>
  <p>{uniqueIds}</p>
</div>

<div className="stat-card">
  <h3>Duplicates</h3>
  <p>{duplicates}</p>
</div>
          <div className="stat-card">
            <h3>Backend Nodes</h3>
            <p>3</p>
          </div>

        </section>


        {/* Generate Section */}
        <section className="generate-card">

          <h2>Generate a Unique ID</h2>

          <p>
            Generate a globally unique, time-ordered 64-bit
            identifier using the distributed Snowflake algorithm.
          </p>

          <button
            onClick={generateId}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate ID"}
          </button>

        </section>


        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}


        {/* Result */}
        {idDetails && (

          <section className="result-card">

            <h2>Latest Generated ID</h2>

            <div className="generated-id">
              {idDetails.id}
            </div>


            <div className="details-grid">

              <div className="detail-card">
                <span>Timestamp</span>
                <strong>{idDetails.timestamp}</strong>
              </div>

              <div className="detail-card">
                <span>Datacenter ID</span>
                <strong>{idDetails.datacenterId}</strong>
              </div>

              <div className="detail-card">
                <span>Machine ID</span>
                <strong>{idDetails.machineId}</strong>
              </div>

              <div className="detail-card">
                <span>Sequence</span>
                <strong>{idDetails.sequence}</strong>
              </div>

            </div>

          </section>

        )}
{history.length > 0 && (
  <section className="history-card">

    <h2>ID Generation History</h2>

    <div className="table-container">

      <table>

        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Datacenter</th>
            <th>Machine</th>
            <th>Sequence</th>
            <th>Timestamp</th>
          </tr>
        </thead>

        <tbody>

          {history.map((item, index) => (

            <tr key={`${item.id}-${index}`}>

              <td>{index + 1}</td>

              <td className="id-column">
                {item.id}
              </td>

              <td>
                {item.datacenterId}
              </td>

              <td>
                {item.machineId}
              </td>

              <td>
                {item.sequence}
              </td>

              <td>
                {new Date(item.timestamp).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  </section>
)}

        {/* Architecture Information */}
        <section className="info-section">

          <h2>System Architecture</h2>

          <div className="architecture">

            <div className="architecture-node">
              React Frontend
            </div>

            <div className="arrow">→</div>

            <div className="architecture-node">
              Nginx Load Balancer
            </div>

            <div className="arrow">→</div>

            <div className="backend-nodes">

              <div>Backend 1</div>
              <div>Backend 2</div>
              <div>Backend 3</div>

            </div>

            <div className="arrow">→</div>

            <div className="architecture-node">
              Snowflake Generator
            </div>

          </div>

        </section>


        {/* Algorithm Information */}
        <section className="info-grid">

          <div className="info-card">
            <h3>64-bit IDs</h3>
            <p>
              Generates numeric identifiers that fit within
              the 64-bit requirement.
            </p>
          </div>

          <div className="info-card">
            <h3>Time Ordered</h3>
            <p>
              Timestamp information allows IDs to be ordered
              by generation time.
            </p>
          </div>

          <div className="info-card">
            <h3>Distributed</h3>
            <p>
              Multiple backend machines generate IDs independently
              using unique machine identifiers.
            </p>
          </div>

        </section>

      </main>

    </div>
  );
}

export default App;