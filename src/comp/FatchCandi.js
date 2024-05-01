import React, { useEffect, useState } from "react";

function FetchCandi({ contract }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        if (contract && contract.methods && contract.methods.getCandidates) {
          await contract.methods.getCandidates().call();
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        
        setLoading(false);
        setError("Failed to fetch candidates. Please try again."); // Set error message
      }
    };

    if (contract) {
      console.log("Contract detected. Fetching candidates...");
      fetchCandidates();
    } else {
      console.log("Contract not detected.");
    }
  }, [contract]); // Only fetch candidates when contract changes

  console.log("Rendering FetchCandi component without candidates");

  return (
    <div>
      <p className="text-neon-blue h3">Candidates</p>{" "}
      {/* Applied text-neon-blue class */}
      {error && <p className="text-danger">{error}</p>}
      <div>
        <button
          className="btn btn-neon-blue rounded-pill mr-4 text-white"
          disabled
        >
          Les
        </button>
        <button className="btn btn-neon-blue rounded-pill text-white" disabled>
          Alex
        </button>
      </div>
    </div>
  );
}

export default FetchCandi;
