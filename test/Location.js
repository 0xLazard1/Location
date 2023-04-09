const chai = require("chai");
const { constants } = require("ethers");
const expect = chai.expect;
const assert = chai.assert;
const { ethers } = require("hardhat");
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);



describe("Location Contract", function () {
    let Location;
    let location;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let renter;

    beforeEach(async function () {
        Location = await ethers.getContractFactory('Location');
        [owner, addr1, addr2, renter, ...addrs] = await ethers.getSigners();
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
            expect(obj.creator).to.equal(ethers.constants.AddressZero);
            expect(obj.originalOwner).to.equal(ethers.constants.AddressZero);
            expect(obj.OwnerRent).to.equal(ethers.constants.AddressZero);
            expect(obj.category).to.equal("");
            expect(obj.lieu).to.equal("");
            expect(obj.isAvailable).to.equal(false);
        });

        describe("Registred a new object", function () {
            it("Should create a new Object", async function () {
                await location.connect(owner).registerObject("Velo", "Velo Simple", 1, 500, "Technologie", "La Rochelle");
                expect(await location.numberOfObjects()).to.equal(1);
                const obj = await location.objects(1);
                expect(obj.id).to.equal(1);
                expect(obj.name).to.equal("Velo");
                expect(obj.description).to.equal("Velo Simple");
                expect(obj.price).to.equal(1);
                expect(obj.timeOfLocation).to.be.closeTo(
                    (await ethers.provider.getBlock()).timestamp + 500, 2
                );
                expect(obj.creator).to.equal(owner.address);
                expect(obj.originalOwner).to.equal(owner.address)
                expect(obj.OwnerRent).to.equal(ethers.constants.AddressZero);
                expect(obj.category).to.equal("Technologie");
                expect(obj.lieu).to.equal("La Rochelle");
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

        describe("ResearchObject", function () {
            it("Should find an object based on the research", async function () {
                await location.connect(owner).registerObject("Velo", "Velo Simple", 1, 500, "Technologie", "La Rochelle");
                const objectExists = await location.connect(addr1).researchAndLocationObject("Technologie", "La Rochelle", "Velo");
                const obj = await location.objects(1);
                expect(obj.category).to.equal("Technologie");
                expect(obj.lieu).to.equal("La Rochelle");
                expect(obj.name).to.equal("Velo");
                expect(objectExists).to.equal(true);
            });

            it("Should not find an object with a different category", async function () {
                await location.connect(owner).registerObject("Velo", "Velo Simple", 1, 500, "Technologie", "La Rochelle");
                const objectExists = await location.connect(addr1).researchAndLocationObject("Livre", "La Rochelle", "Velo");
                expect(objectExists).to.equal(false);
            });

            it("Should not find an object with a different lieu", async function () {
                await location.connect(owner).registerObject("Velo", "Velo Simple", 1, 500, "Technologie", "La Rochelle");
                await location.connect(owner).registerObject("Trottinette", "Trottinette électrique", 1, 500, "Technologie", "Paris");
                const objectExists = await location.connect(addr1).researchAndLocationObject("Technologie", "Paris", "Velo");
                expect(objectExists).to.equal(false);
            });



            // it("Should not find an object with a different name", async function () {
            //     await location.connect(owner).registerObject("Pipette", "MicroLitre", 1, 400, "Technologie", "Klaipeda");
            //     await location.connect(owner).registerObject("Trottinette", "Trottinette électrique", 1, 500, "Technologie", "Paris");
            //     const ObjExt = await location.connect(addr1).researchAndLocationObject("Pipete", "Technologie", "Klaipeda");
            //     expect(ObjExt).to.equal(false);
            // });
        })

        describe("RendObject", function () {

            it("Should don't find Id", async function () {
                await location.connect(owner).registerObject("Velo", "Joli", 1, 500, "Livre", "LaRochelle");
                const obj = location.connect(addr1).RentObject(2);
                expect(obj.id).to.be.revertedWith("Id does not exit");
            })

            it("Should buy a object", async function () {
                await location.connect(addr1).registerObject("Ciseaux", "Joli Ciseaux", 2, 500, "Livre", "Vilnius");
                const price = ethers.utils.parseEther("1");
                const tx = await location.connect(addr2).RentObject(1, { value: price });
                await tx.wait()
                const obj = await location.objects(1);
                expect(obj.OwnerRent).to.equal(addr2.address);
                expect(obj.creator).to.equal(addr1.address);
                expect(obj.originalOwner).to.equal(addr1.address);
            })
        })


    });
})