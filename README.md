
# Location Smart Contract

A user-friendly location smart contract built on Ethereum using Solidity. This project demonstrates the registration, searching, renting, and returning of objects using a decentralized platform.

## Table of Contents

1. [Introduction](#introduction)
2. [Features](#features)
3. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running Tests](#running-tests)
4. [Usage](#usage)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction

This location smart contract allows users to register objects for rent and manage the rental process in a decentralized manner. It ensures transparency and security while providing a seamless user experience.

## Features

- Register objects with a name, description, price, location, and category
- Check for the existence of categories, locations, and names
- Search for objects based on category, location, and name
- Rent objects by providing the object ID
- Check if the rental period of an object has ended
- Return rented objects

## Getting Started

These instructions will help you set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js v14.x or later
- npm v7.x or later
- Hardhat v5.x or later - Ethereum development environment for compiling, testing, and deploying smart contracts
- Solidity v0.8.19
- Web3.js v1.x or later

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/location-smart-contract.git
```
2. Change to the project directory
```
cd location-smart-contract
```
3. Install dependencies
```
npm install
```

### Running Tests

To test the smart contract, run the following command:
```
npx hardhat test
```

## Usage

You can interact with the smart contract using Truffle, Hardhat, or any other Ethereum development framework. The main functions available for interaction are:

- `registerObject(string memory _name, string memory _description, uint256 _price, uint256 _timeOfLocation, string memory _category, string memory _lieu)` - Registers an object for rent with a specified name, description, price, location, and category.
- `categoryExists(string memory category)` - Checks if a given category exists.
- `lieuExists(string memory lieu)` - Checks if a given location exists.
- `nameExists(string memory _name)` - Checks if a given name exists.
- `researchAndLocationObject(string memory _category, string memory _lieu, string memory _name)` - Searches for objects based on category, location, and name.
- `RentObject(uint256 _id)` - Rents an object by providing its ID.
- `isLocationEnded(uint256 _id)` - Checks if the rental period of an object has ended.
- `ReturnObject(uint256 _id)` - Returns a rented object.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests for improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.
