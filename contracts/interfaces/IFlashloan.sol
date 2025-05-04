// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IFlashloan {
    struct Hop {
        uint8 protocol;
        bytes data;
        address[] path;
    }
    struct Route {
        Hop[] hops;
        uint16 part;
    }
    struct FlashParams {
        Route[] routes;
        uint256 loanAmount;
        address flashLoanPool;
    }

}