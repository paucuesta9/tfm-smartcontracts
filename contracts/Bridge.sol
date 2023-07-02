// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IToken.sol";

contract Bridge {
    address public bridgeAdmin;
    IToken public token;
    mapping(address => mapping(uint => bool)) public processedNonces;

    event Transfer(
        address userAddress,
        uint amount,
        uint date,
        uint nonce,
        bytes signature
    );

    constructor(address _token) {
        bridgeAdmin = msg.sender;
        token = IToken(_token);
    }

    function burn(uint amount, uint nonce, bytes calldata signature) external {
        require(
            processedNonces[msg.sender][nonce] == false,
            "The transaction has already been processed"
        );

        processedNonces[msg.sender][nonce] = true;

        token.burn(msg.sender, amount);

        emit Transfer(msg.sender, amount, block.timestamp, nonce, signature);
    }

    function mint(
        address userAddress,
        uint amount,
        uint newAmount,
        uint nonce,
        bytes calldata signature
    ) external {
        bytes32 message = keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n32",
                keccak256(abi.encodePacked(userAddress, amount, nonce))
            )
        );
        require(
            recoverSigner(message, signature) == userAddress,
            "The signature is not valid"
        );
        require(
            processedNonces[userAddress][nonce] == false,
            "The transaction has already been processed"
        );

        processedNonces[userAddress][nonce] = true;

        token.mint(userAddress, newAmount);
    }

    function recoverSigner(
        bytes32 message,
        bytes memory signature
    ) internal pure returns (address) {
        uint8 v;
        bytes32 r;
        bytes32 s;

        (v, r, s) = splitSignature(signature);

        return ecrecover(message, v, r, s);
    }

    function splitSignature(
        bytes memory signature
    ) internal pure returns (uint8, bytes32, bytes32) {
        require(signature.length == 65);

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(signature, 32))
            s := mload(add(signature, 64))
            v := byte(0, mload(add(signature, 96)))
        }

        return (v, r, s);
    }
}
