// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./Bridge.sol";

contract BridgePol is Bridge {
    constructor(address token) Bridge(token) {}
}
