const { ethers } = require("hardhat");

async function estimateGas() {
    const [owner] = await ethers.getSigners();
    const Location = await ethers.getContractFactory("Location");

    // Estimate the gas for deploying the contract
    const transaction = await Location.getDeployTransaction();
    const gasEstimate = await ethers.provider.estimateGas(transaction);
    const gasPrice = await ethers.provider.getGasPrice();
    const gasCost = gasEstimate.mul(gasPrice);

    console.log(`Gas estimate for ObjectRegister: ${gasEstimate}`);
    console.log(`Gas price: ${ethers.utils.formatUnits(gasPrice, "gwei")} Gwei`);
    console.log(`Gas cost in ethers: ${ethers.utils.formatEther(gasCost)}`);
}

estimateGas();


