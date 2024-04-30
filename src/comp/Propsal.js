import React, { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import Web3 from "web3"; // Import Web3 instead of 'web3'
import "./Proposal.css"; // Import CSS file for styling

function Propsal({ contract, account, provider }) {
  const [showPropsal, setShowPropsal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState(null);
  const predefinedAddresses = [
    "0x6BC5BC90D9e80A4504b69B0118282898ce6BbeB1",
    "0x2AAD4FFDefCAB7D7Dd0B8D500a8f70c1A38513e4",
  ];
  const [selectedAddress, setSelectedAddress] = useState(""); // State for selected address
  const [selectedName, setSelectedName] = useState(""); // State for selected name

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
    const accountInput = selectedAddress; // Use the selected address
    const nameInput = selectedName; // Use the selected name

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

  return (
    <div>
      <br />
      <button onClick={togglePropsalForm} className="btn btn-neon-blue">
        Send Proposal For Next Election!
      </button>
      {showPropsal && (
        <form onSubmit={submitPropsal} className="form-group">
          <div className="m-3">
            <p className="h5">Connected Address:</p>
            <div className="connected-address">{account}</div>
          </div>
          <div className="p-2">
            Address of Candidate:
            <select
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)} // Set selected address
              className="form-control"
            >
              <option value="">Select Candidate Address</option>
              {predefinedAddresses.map((address, index) => (
                <option key={index} value={address}>
                  {address}
                </option>
              ))}
            </select>
          </div>
          <div className="p-2">
            Name of Candidate:
            <select
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)} // Set selected name
              className="form-control"
            >
              <option value="">Select Candidate Name</option>
              <option value="Alex">Alex</option>
              <option value="Les">Les</option>
            </select>
          </div>
          <button type="submit" className="btn btn-neon-blue mt-2">
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
                <td className="p-2">Name:</td>
                <td className="p-2">{newCandidate.name}</td>
              </tr>
              <tr>
                <td className="p-2">Address:</td>
                <td className="p-2">{newCandidate._CandidateAddress}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        {candidates.map((candidate) => (
          <div key={candidate.name}>
            <table>
              <tbody>
                <tr>
                  <td className="p-2">Name:</td>
                  <td className="p-2">{candidate.name}</td>
                </tr>
                <tr>
                  <td className="p-2">Address:</td>
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
