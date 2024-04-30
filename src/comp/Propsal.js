import React, { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import Web3 from "web3"; // Import Web3 instead of 'web3'

function Propsal({ contract, account, provider }) {
  const [showPropsal, setShowPropsal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState(null);

  useEffect(() => {
    if (contract) {
      fetchCandidates();
    }
  }, [contract]);

  useEffect(() => {
    // Load candidates from local storage when the component mounts
    const savedCandidates = JSON.parse(localStorage.getItem("candidates"));
    if (savedCandidates) {
      setCandidates(savedCandidates);
    }
  }, []);

  const togglePropsalForm = () => {
    setShowPropsal(!showPropsal);
  };

  const submitPropsal = async (e) => {
    e.preventDefault();
    const accountInput = document.getElementById("Account").value;
    const nameInput = document.getElementById("Name").value;

    console.log("Account:", accountInput);
    console.log("Name:", nameInput);

    if (!Web3.utils.isAddress(accountInput)) {
      alert("Invalid address for Candidate Account");
      return;
    }

    if (!nameInput) {
      alert("Name cannot be empty");
      return;
    }

    setLoading(true);

    try {
      const tx = await contract.RequestForNextVoting(accountInput, nameInput);
      const receipt = await tx.wait();
      console.log("Submitted successfully!");
      console.log("Receipt:", receipt);

      // Update candidates list after successful transaction
      fetchCandidates();

      // Set the new candidate for rendering
      setNewCandidate({ name: nameInput, _CandidateAddress: accountInput });

      setLoading(false);
    } catch (error) {
      console.error("Error while submitting proposal:", error);
      alert("Failed to submit proposal. Please check console for details.");
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const fetchedCandidates = await contract.getRequestPropsal();
      console.log("Fetched candidates:", fetchedCandidates);
      setCandidates(fetchedCandidates);

      // Save candidates to local storage
      localStorage.setItem("candidates", JSON.stringify(fetchedCandidates));
    } catch (error) {
      console.error("Error while fetching candidates:", error);

    }
  };

  const disconnect = () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        window.localStorage.removeItem("Connected");
        window.location.reload();
      } else {
        // Handle case if already disconnected
      }
    }
  };

  return (
    <div>
      <br />
      <button onClick={togglePropsalForm} className="btn btn-primary">
        Send Proposal For Next Election!
      </button>
      <button onClick={disconnect} className="btn btn-danger ml-2">
        Disconnect
      </button>
      {showPropsal && (
        <form onSubmit={submitPropsal} className="form-group">
          <div className="m-3">
            <p className="h5">Connected Address: {account}</p>
          </div>
          <div className="p-2">
            Address of Candidate:
            <input type="text" id="Account" className="form-control" />
          </div>
          <div className="p-2">
            Name of Candidate:
            <input type="text" id="Name" className="form-control" />
          </div>
          <button type="submit" className="btn btn-dark mt-2">
            {!loading ? (
              "Submit Now!"
            ) : (
              <ReactBootStrap.Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </button>
        </form>
      )}
      <br />

      {/* Render the new candidate's details */}
      {newCandidate && (
        <div>
          <h4>Newly Added Candidate:</h4>
          <table>
            <tbody>
              <tr>
                <td className="p-2">Name: {newCandidate.name}</td>
                <td className="p-2">
                  Address: {newCandidate._CandidateAddress}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <button onClick={fetchCandidates} className="btn btn-success">
          Fetch Next Candidates
        </button>
        {candidates.map((candidate) => (
          <div key={candidate.name}>
            <table>
              <tbody>
                <tr>
                  <td className="p-2">{candidate.name}</td>
                  <td className="p-2">{candidate._CandidateAddress}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Propsal;
