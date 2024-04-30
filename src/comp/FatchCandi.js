import React, { useEffect, useState } from "react";

function FetchCandi({ contract }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        setLoading(true);
        console.log("Fetching candidates...");
        if (contract && contract.methods && contract.methods.getCandidates) {
          await contract.methods.getCandidates().call();
          setLoading(false);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching candidates:", error);
        setLoading(false);
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
      <p className="text-dark h3">Candidates</p>
      {loading && <p className="text-dark">Loading candidates...</p>}
      {error && <p className="text-danger">{error}</p>}
    </div>
  );
}

export default FetchCandi;
