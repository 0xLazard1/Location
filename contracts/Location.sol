//SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Location {
    address public owner;
    uint256 public numberOfObjects = 0;
    string[2] categories = ["Technologie", "Livre"];
    string[] lieux;

    struct Object {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 timeOfLocation;
        address payable owner;
        string category;
        string lieu;
        bool isAvailable;
    }

    mapping(uint256 => Object) public objects;

    constructor() {
        owner = msg.sender;
    }

    function registerObject(
        string memory _name,
        string memory _description,
        uint256 _price,
        uint256 _timeOfLocation,
        string memory _category,
        string memory _lieu
    ) external {
        require(msg.sender != address(0), "Invalid address");
        require(categoryExists(_category), "Category does not exist");

        if (!lieuExists(_lieu)) {
            lieux.push(_lieu);
        }

        numberOfObjects++;

        Object storage object = objects[numberOfObjects];
        object.id = numberOfObjects;
        object.name = _name;
        object.description = _description;
        object.price = _price;
        object.timeOfLocation = block.timestamp + _timeOfLocation;
        object.owner = payable(msg.sender);
        object.category = _category;
        object.lieu = _lieu;
        object.isAvailable = true;
    }

    function categoryExists(string memory category) public view returns (bool) {
        for (uint256 i = 0; i < categories.length; i++) {
            if (keccak256(bytes(categories[i])) == keccak256(bytes(category))) {
                return true;
            }
        }
        return false;
    }

    function lieuExists(string memory lieu) public view returns (bool) {
        for (uint256 i = 0; i < lieux.length; i++) {
            if (keccak256(bytes(lieux[i])) == keccak256(bytes(lieu))) {
                return true;
            }
        }
        return false;
    }

    function ResearchObject(string memory category, string memory lieu) external view returns()
}
