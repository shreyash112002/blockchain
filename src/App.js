import { ethers } from "ethers";
import * as ReactBootStrap from "react-bootstrap";
import { useState, useEffect } from "react";
import ABIFILE from "./artifacts/contracts/BlockchainVoting.sol/BlockchainVoting.json";
import FetchCandi from "./comp/FatchCandi";
import FatcVoter from "./comp/FatcVoter";
import Proposal from "./comp/Propsal";
import Vote from "./comp/Vote";
const ABI = ABIFILE.abi;
const ContractAddress = "0x0fee2908afda3d25e876c05ed5a6b9e40c37d909";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isOff, setIsOff] = useState(false);
  const [loading, setLoading] = useState(false);

  const Disconnect = async () => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        window.localStorage.removeItem("Connected");
        setIsOff(false);
        window.location.reload();
      } else {
        // Handle case if already disconnected
      }
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("Connected")) {
        Connect();
      }
    }
  }, []);

  const Connect = async (e) => {
    setLoading(true);
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setIsOff(true);
      window.localStorage.setItem("Connected", "injected");
      console.log(accounts);
      setAccount(accounts);

      // Truncate the account address if it exceeds a certain length
      const truncatedAccount =
        accounts.length > 12 ? `${accounts.slice(0, 12)}...` : accounts;
      document.getElementById("connectbtn").innerHTML = truncatedAccount;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const signer = provider.getSigner();
      console.log(signer);
      const contract = new ethers.Contract(ContractAddress, ABI, signer);
      setContract(contract);
      console.log("Contract Address:", contract.address); // Log contract address here
      console.log(contract);
    }
  };

  return (
    <div
      className="mx-auto p-4 text-light shadow-neon"
      style={{
        maxWidth: 1200,
        margin: "auto",
        marginTop: 20, // Decreased height
        marginBottom: 20, // Decreased height
        backgroundColor: "black",
        border: "3px solid #0ff", // Neon blue border
      }}
    >
      <p className="text-center h5 neon-blue-text p-2">
        Blockchain for Electronic Voting System
      </p>
      <div className="d-flex justify-content-start">
        {" "}
        {/* Adjusted justify-content to start */}
        <button
          onClick={Connect}
          id="connectbtn"
          className="btn btn-neon-blue mx-2" // Changed margin to mx-2 for spacing
          style={{ height: 60, overflow: "hidden", textOverflow: "ellipsis" }} // Adjust button height and text overflow
        >
          {!loading ? (
            "Connect"
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
        <button
          onClick={Disconnect}
          className="btn btn-neon-blue mx-4" // Changed margin to mx-4 for spacing
          disabled={!isOff}
          style={{ height: 60 }} // Adjust button height as needed
        >
          Disconnect
        </button>
      </div>

      <br />

      <FetchCandi contract={contract} account={account} provider={provider} />

      <Vote contract={contract} account={account} provider={provider} />

      <FatcVoter contract={contract} account={account} provider={provider} />

      <Proposal contract={contract} account={account} provider={provider} />
    </div>
  );
}

export default App;
