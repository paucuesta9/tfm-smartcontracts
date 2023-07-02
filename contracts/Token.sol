// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    address public admin;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        admin = msg.sender;
    }

    function updateAdmin(address newAdmin) external {
        require(msg.sender == admin, "Action not allowed");
        admin = newAdmin;
    }

    function mint(address to, uint amount) external {
        require(msg.sender == admin, "Action not allowed");
        _mint(to, amount);
    }

    function burn(address owner, uint amount) external {
        require(msg.sender == admin, "Action not allowed");
        _burn(owner, amount);
    }
}
