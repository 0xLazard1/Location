//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Location {
    address public owner;
    uint256 public NumberOfObject = 0;
    string[2] Categorie = ["Technologie", "Livre"];

    struct Object {
        uint256 id;
        string names;
        string descriptions;
        uint256 prices;
        uint256 timesoflocations;
        address payable owner;
        string categorie;
    }

    mapping(uint256 => Object) public Objects;

    constructor() {
        owner = msg.sender;
    }

    function ObjectRegister(
        string memory _names,
        string memory _description,
        uint256 _price,
        uint256 _timeOfLocation,
        string memory _categorie
    ) external {
        require(msg.sender != address(0), "!Not people");
        require(CategorieExit(_categorie), "!CategoerieExistepas");
        NumberOfObject++;

        Object storage object = Objects[NumberOfObject];
        object.id = NumberOfObject;
        object.names = _names;
        object.descriptions = _description;
        object.prices = _price;
        object.timesoflocations = block.timestamp + _timeOfLocation;
        object.owner = payable(msg.sender);
        object.categorie = _categorie;
    }

    function CategorieExit(string memory categorie) public view returns (bool) {
        for (uint256 i = 0; i < Categorie.length; i++) {
            if (keccak256(bytes(Categorie[i])) == keccak256(bytes(categorie)))
                return true;
        }
        return false;
    }
}
