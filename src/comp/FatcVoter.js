import React, { useState, useEffect } from "react";

function FatcVoter({ contract }) {
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const fetchedVoters = await contract.getVoters();
        
        setVoters(fetchedVoters);
      } catch (error) {
        
      }
    };

    if (contract) {
      fetchVoters();
    }
  }, [contract]);

  return (
    <div>
      <p className="text-neon-blue h3">Voters Information</p>{" "}
      {/* Applied text-neon-blue class */}
      {voters.map((voter, index) => (
        <div key={index}>
          <table>
            <tbody>
              <tr className="p-2">
                <td className="p-2">Voter Name: {voter.name}</td>
                <td className="p-2">Voter Address: {voter.voterAddress}</td>
                <td className="p-2">Voted To: {voter.candidateAddress}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

export default FatcVoter;
