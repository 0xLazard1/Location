// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract Location {
    address public owner;
    uint256 public numberOfObjects;
    string[5] categories = [
        "Technologie",
        "Livre",
        "Loisir",
        "Voiture",
        "Autres"
    ];
    string[] lieux;
    string[] names;

    struct Object {
        uint256 id;
        string name;
        string description;
        uint256 price;
        uint256 timeOfLocation;
        address owner;
        string category;
        string lieu;
        bool isAvailable;
    }

    mapping(uint256 => Object) public objects;

    event RentStarted(
        uint256 indexed _id,
        address indexed _renter,
        uint256 _rentStartTime
    );

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

        if (!nameExists(_name)) {
            names.push(_name);
        }

        numberOfObjects++;

        Object storage object = objects[numberOfObjects];
        object.id = numberOfObjects;
        object.name = _name;
        object.description = _description;
        object.price = _price;
        object.timeOfLocation = block.timestamp + _timeOfLocation;
        object.owner = msg.sender;
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

    function nameExists(string memory _name) public view returns (bool) {
        for (uint256 i = 0; i < names.length; i++) {
            if (keccak256(bytes(names[i])) == keccak256(bytes(_name))) {
                return true;
            }
        }
        return false;
    }

    function researchAndLocationObject(
        string memory _category,
        string memory _lieu,
        string memory _name
    ) external view returns (bool) {
        require(categoryExists(_category), "Category does not exist");
        require(lieuExists(_lieu), "Lieu does not exist");
        require(nameExists(_name), "Name does not exist");

        for (uint256 i = 1; i <= numberOfObjects; i++) {
            if (
                keccak256(bytes(objects[i].name)) == keccak256(bytes(_name)) &&
                keccak256(bytes(objects[i].category)) ==
                keccak256(bytes(_category)) &&
                keccak256(bytes(objects[i].lieu)) == keccak256(bytes(_lieu)) &&
                objects[i].isAvailable
            ) {
                return true;
            }
        }
        return false;
    }

    function RentObject(uint256 _id) external payable {
        Object storage object = objects[_id];
        require(object.id != 0, "Id does not exist");
        require(object.isAvailable, "Object does not exist");
        require(msg.value >= object.price, "Not enough funds");
        address payable previousOwner = payable(object.owner);
        previousOwner.transfer(object.price);
        object.isAvailable = false;
        object.owner = msg.sender;
        object.timeOfLocation = block.timestamp;
        emit RentStarted(_id, msg.sender, block.timestamp);
    }

    function isLocationEnded(uint256 _id) external view returns (bool) {
        Object storage object = objects[_id];
        require(object.id != 0, "Id does not exist");
        return (block.timestamp >= object.timeOfLocation);
    }
}
