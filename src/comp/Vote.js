import React, { useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import { Web3 } from "web3"; // Correct import statement
import "./Proposal.css"; // Import CSS file for styling

function Vote({ contract, account, provider }) {
  const [showVote, setShowVote] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voterId, setVoterId] = useState("");
  const [voterName, setVoterName] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");
  const [voterDetails, setVoterDetails] = useState(null);
  const [predefinedAddresses, setPredefinedAddresses] = useState([
    { address: "0x6BC5BC90D9e80A4504b69B0118282898ce6BbeB1", name: "Les" },
    { address: "0x2AAD4FFDefCAB7D7Dd0B8D500a8f70c1A38513e4", name: "Alex" },
  ]);

  const toggleVoteForm = () => {
    setShowVote(!showVote);
  };

  const handleVote = async (e) => {
    e.preventDefault();
    if (!voterId || !voterName || !candidateAddress) {
      alert("Please fill in all fields");
      return;
    }

    // Validate Ethereum addresses
    const web3 = new Web3(); // Initialize Web3

    const voterAddress = Array.isArray(account) ? account[0] : account;

    if (!web3.utils.isAddress(voterAddress)) {
      alert("Invalid voter address");
      return;
    }
    if (!web3.utils.isAddress(candidateAddress)) {
      alert("Invalid candidate address");
      return;
    }

    setLoading(true);

    try {
      await contract
        .connect(provider.getSigner())
        .SetVote(voterId, voterName, voterAddress, candidateAddress);
      console.log("Voted Successfully");

      // Store voter details locally
      setVoterDetails({
        voterId: voterId,
        voterName: voterName,
        voterAddress: voterAddress,
        candidateAddress: candidateAddress,
      });

      // You can update the UI to reflect the vote status instead of reloading the window
    } catch (error) {
      console.error("Error while voting:", error);
      // Display error message in the UI instead of using alert
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <br />
      <div>
        <button
          onClick={toggleVoteForm}
          disabled={!account}
          className="btn btn-neon-blue text-light"
        >
          Vote To Candidate!
        </button>
      </div>
      <br />
      {showVote && (
        <form onSubmit={handleVote}>
          <div className="mt3">
            <p className="h5 connected-address">Voter Address : {account}</p>
          </div>
          <div className="form-group">
            <label>Your ID</label>
            <input
              type="text"
              color="black"
              value={voterId}
              onChange={(e) => setVoterId(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Your Name</label>
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Candidate Address</label>
            <select
              value={candidateAddress}
              onChange={(e) => setCandidateAddress(e.target.value)}
              className="form-control"
            >
              <option value="">Select Candidate Address</option>
              {predefinedAddresses.map((candidate, index) => (
                <option key={index} value={candidate.address}>
                  {`${candidate.name} - ${candidate.address}`}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-neon-blue mt-2"
            disabled={loading}
          >
            {!loading ? (
              "Vote Now"
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
      {voterDetails && (
        <div className="mt-3 text-white">
          <h5>Voter Details:</h5>
          <p>Voter ID: {voterDetails.voterId}</p>
          <p>Voter Name: {voterDetails.voterName}</p>
          <p>Voter Address: {voterDetails.voterAddress}</p>
          <p>Candidate Voted for: {voterDetails.candidateAddress}</p>
        </div>
      )}
    </div>
  );
}

export default Vote;
