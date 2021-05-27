// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

contract Wallet {
    address[] public approvers;
    uint256 public quorum;

    struct Transfer {
        uint256 id;
        uint256 amount;
        address payable to;
        uint256 approvals;
        bool sent;
    }

    Transfer[] public transfers;
    uint256 nextId = 0;

    mapping(address => mapping(uint256 => bool)) public approvals;

    constructor(address[] memory _approvers, uint256 _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns (address[] memory) {
        return approvers;
    }

    function getTransfers() external view returns (Transfer[] memory) {
        return transfers;
    }

    function createTransfer(uint256 amount, address payable to)
        external
        OnlyApprover()
    {
        transfers.push(Transfer(nextId, amount, to, 0, false));
        nextId++;
    }

    function approveTransfer(uint256 id) external OnlyApprover() {
        require(transfers[id].sent == false, "transfer has already been sent");
        require(
            approvals[msg.sender][id] == false,
            "already approved this transfer"
        );

        transfers[0].approvals++;
        approvals[msg.sender][id] = true;

        if (transfers[id].approvals >= quorum) {
            transfers[id].sent = true;
            transfers[id].to.transfer(transfers[id].amount);
        }
    }

    modifier OnlyApprover() {
        bool allowed = false;
        for (uint256 i = 0; i < approvers.length; i++) {
            if (msg.sender == approvers[i]) allowed = true;
        }
        require(allowed == true, "Sender is not a approver");
        _;
    }

    receive() external payable {}
}
