const chai = require("chai");
const { constants } = require("ethers");
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

    describe("Deployment", function () {
        it("Should be owner to equal at msg.sender", async function () {
            expect(await location.owner()).to.equal(owner.address);
        });

        it("Should be numberofprojets equal at 0", async function () {
            expect(await location.numberOfObjects()).to.equal(0);
        })

        it("Should be Object is not defined", async function () {
            const obj = await location.objects(0);
            expect(obj.id).to.equal(0);
            expect(obj.name).to.equal("");
            expect(obj.description).to.equal("");
            expect(obj.price).to.equal(0);
            expect(obj.timeOfLocation).to.equal(0);
            expect(obj.owner).to.equal(ethers.constants.AddressZero);
            expect(obj.category).to.equal("");
            expect(obj.lieu).to.equal("");
            expect(obj.isAvailable).to.equal(false);
        });

        describe("Registred a new object", function () {
            it("Should create a new Object", async function () {
                await location.connect(owner).registerObject("Velo", "Velo Simple", 1, 500, "Technologie", "Vilnius");
                expect(await location.numberOfObjects()).to.equal(1);
                const obj = await location.objects(1);
                expect(obj.id).to.equal(1);
                expect(obj.name).to.equal("Velo");
                expect(obj.description).to.equal("Velo Simple");
                expect(obj.price).to.equal(1);
                expect(obj.timeOfLocation).to.be.closeTo(
                    (await ethers.provider.getBlock()).timestamp + 500, 2
                );
                expect(obj.owner).to.equal(owner.address);
                expect(obj.category).to.equal("Technologie");
                expect(obj.lieu).to.equal("Vilnius");
                expect(obj.isAvailable).to.equal(true);
            });
        })

        describe("IsExists", function () {
            it("Should says that CategorieExit", async function () {
                const result = await location.categoryExists("Technologie");
                expect(result).to.equal(true);
            })

            it("Should says don't CategorieExit", async function () {
                const result = await location.categoryExists("");
                expect(result).to.equal(false);
            })
        })
    });


})