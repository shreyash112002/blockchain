import React, { useState, useEffect } from "react";
import * as ReactBootStrap from "react-bootstrap";
import Web3 from "web3"; // Import Web3 instead of 'web3'
import "./Proposal.css"; // Import CSS file for styling

function Proposal({ contract, account, provider, handleNewAddress }) {
  const [showProposal, setShowProposal] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCandidate, setNewCandidate] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(""); // State for selected address
  const [selectedName, setSelectedName] = useState(""); // State for selected name
  const [receipt, setReceipt] = useState(null); // State for receipt

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

  const toggleProposalForm = () => {
    setShowProposal(!showProposal);
  };

  const submitProposal = async (e) => {
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

      // Pass the new address to the handleNewAddress function
      handleNewAddress(accountInput);

      // Set receipt in state
      setReceipt(receipt);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const fetchedCandidates = await contract.getRequestPropsal();
      setCandidates(fetchedCandidates);

      // Save candidates to local storage
      localStorage.setItem("candidates", JSON.stringify(fetchedCandidates));
    } catch (error) {
      
    }
  };

  return (
    <div>
      <br />
      <button onClick={toggleProposalForm} className="btn btn-neon-blue">
        Send Proposal For Next Election!
      </button>
      {showProposal && (
        <form onSubmit={submitProposal} className="form-group">
          <div className="m-3">
            <p className="h5">Connected Address:</p>
            <div className="connected-address">{account}</div>
          </div>
          <div className="p-2">
            Address of Candidate:
            <input
              type="text"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)} // Set selected address
              className="form-control"
            />
          </div>
          <div className="p-2">
            Name of Candidate:
            <input
              type="text"
              value={selectedName}
              onChange={(e) => setSelectedName(e.target.value)} // Set selected name
              className="form-control"
            />
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

      {/* Display receipt if available */}
      {receipt && (
        <div>
          <h4>Transaction Receipt:</h4>
          <p>Sender Name: {receipt.from}</p>
          <p>Receiver Name: {receipt.to}</p>
          <p>Gas Used: {receipt.gasUsed}</p>
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

export default Proposal;
