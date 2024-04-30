// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error _CandidateAlreadyExit();
error _AlreadyVoted();
error _CandidateNotVoteItSlef();
error _VoterNotFound();

contract BlockchainVoting {
    address public manager;
    uint256 public totalCandidates;
    uint256 public totalVoters;

    constructor() {
        manager = msg.sender;
    }

    struct Voter {
        uint256 id;
        string name;
        address voterAddress;
        address candidateAddress;
    }

    struct Candidate {
        string name;
        address candidateAddress;
        uint256 vote;
    }

    struct Proposal {
        string name;
        address proposalAddress;
    }

    Voter[] public voters;
    Candidate[] public candidates;
    Proposal[] public proposals;

    function setCandidate(
        address _address,
        string memory _name
    ) external onlyManager {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].candidateAddress == _address) {
                revert _CandidateAlreadyExit();
            }
        }
        candidates.push(Candidate(_name, _address, 0));
        totalCandidates++;
    }

    function addVoter(
        uint256 _id,
        string memory _name,
        address _voterAddress,
        address _candidateAddress
    ) external onlyManager {
        voters.push(Voter(_id, _name, _voterAddress, _candidateAddress));
        totalVoters++;
    }

    function setVote(
        uint256 _id,
        string memory _name,
        address _voterAddress,
        address _candidateAddress
    ) external {
        require(
            candidates.length >= 2,
            "Candidate count must be greater than or equal to 2"
        );
        for (uint256 i = 0; i < voters.length; i++) {
            if (
                voters[i].id == _id && voters[i].voterAddress == _voterAddress
            ) {
                revert _AlreadyVoted();
            }
        }

        bool foundCandidate = false;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].candidateAddress == _candidateAddress) {
                foundCandidate = true;
                candidates[i].vote++;
                voters.push(
                    Voter(_id, _name, _voterAddress, _candidateAddress)
                );
                totalVoters++;
                break; // Exit loop once the candidate is found
            }
        }

        if (!foundCandidate) {
            revert _CandidateNotVoteItSlef();
        }
    }

    function requestForNextVoting(
        address _requestAddress,
        string memory _name
    ) external {
        proposals.push(Proposal(_name, _requestAddress));
    }

    function getRequestProposal() external view returns (Proposal[] memory) {
        return proposals;
    }

    function getCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    function getVoters() external view returns (Voter[] memory) {
        return voters;
    }

    function getVoterDetails(address _voterAddress) external view returns (Voter memory) {
        for (uint256 i = 0; i < voters.length; i++) {
            if (voters[i].voterAddress == _voterAddress) {
                return voters[i];
            }
        }
        revert _VoterNotFound();
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }
}
