const chai = require("chai");
const expect = chai.expect;
const { ethers } = require("hardhat");

describe("Location Contract", function () {
    let Location;
    let location;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        Location = await ethers.getContractFactory('Location');
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        location = await Location.deploy();
        await location.deployed();
    })

    describe('Deployment', function () {
        it("Should set owner equal to msg.sender", async function () {
            expect(await location.owner()).to.equal(owner.address);
        });

        it("Should set NumberOfObject to 0", async function () {
            expect(await location.NumberOfObject()).to.equal(0);
        })

        it("Should initialize Object with zero values", async function () {
            const obj = await location.Objects(0);
            expect(obj.id).to.equal(0);
            expect(obj.names).to.equal("");
            expect(obj.descriptions).to.equal("");
            expect(obj.prices).to.equal(0);
            expect(obj.timesoflocations).to.equal(0);
            expect(obj.owner).to.equal(ethers.constants.AddressZero);
            expect(obj.categorie).to.equal("");
        });
    })

    describe('CreateObject', function () {
        it('Should add new object', async function () {

            await location.connect(owner).ObjectRegister("Lampes", "Jolie Lampes", 1, 500, "Technologie");
            expect(await location.NumberOfObject()).to.equal(1);

            const obj = await location.Objects(1);
            expect(obj.id).to.equal(1);
            expect(obj.names).to.equal("Lampes");
            expect(obj.descriptions).to.equal("Jolie Lampes");
            expect(obj.prices).to.equal(1);
            expect(obj.timesoflocations).to.be.closeTo(
                (await ethers.provider.getBlock()).timestamp + 500, 2
            );
            expect(obj.owner).to.equal(owner.address);
            expect(obj.categorie).to.equal("Technologie");
        })
    })

    describe('CategorieExit', function () {
        it('Should return true for an existing category', async function () {
            const result = await location.CategorieExit("Technologie");
            expect(result).to.equal(true);
        })

        it('Should return false for a non-existing category', async function () {
            const result = await location.CategorieExit("NonExistingCategory");
            expect(result).to.equal(false);
        })
    })
})
