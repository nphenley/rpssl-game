import { ethers } from "ethers";
import hashContract from "hasher.json";
import gameContract from "contract.json";
import { stringify } from "querystring";

const getProvider = (): ethers.providers.Web3Provider => {
  return new ethers.providers.Web3Provider((window as any).ethereum);
};

export const connectToMetamask = async () => {
  const provider = getProvider();
  return provider.send("eth_requestAccounts", []);
};

// EthersJS hasn't implemented this yet
// https://github.com/ethers-io/ethers.js/issues/899
export const initListenerForConnectedAddresses = async (callback: any) => {
  (window as any).ethereum.on("accountsChanged", callback);
};

export const checkForConnectedAddresses = async (callback: any) => {
  const provider = getProvider();
  return provider.send("eth_accounts", []).then(callback);
};

export const getConnectedAddress = async (callback: any) => {
  const provider = getProvider();
  return provider.send("eth_accounts", []).then(callback);
};

export const getBalance = async () => {
  const signer = await getSigner();
  const balance = await signer.getBalance();
  return balance;
};

export const getHash = async (move: string, salt: string) => {
  const signer = await getSigner();
  const hashContractInstance = new ethers.Contract(
    hashContract.address,
    hashContract.abi,
    signer
  );

  let hashedMove = await hashContractInstance.hash(move, salt);
  return hashedMove;
};

export const getSigner = async () => {
  const provider = getProvider();
  return provider.getSigner();
};

export const callTimeout = async (address: string, fromPlayer: "1" | "2") => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );
  let tx;
  if (fromPlayer === "1") tx = await gameContractInstance.j2Timeout();
  else tx = await gameContractInstance.j1Timeout();
  return tx;
};

export const getStake = async (address: string) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const stake = await gameContractInstance.stake();
  return stake;
};

export const getPlayer2Move = async (address: string) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const c2 = await gameContractInstance.c2();
  return c2;
};

export const getPlayer2 = async (address: string) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const p2 = await gameContractInstance.j2();
  return p2;
};

export const getPlayer1 = async (address: string) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const p1 = await gameContractInstance.j1();
  return p1;
};

export const getWinner = async (address: string, c1: string, c2: string) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const win = await gameContractInstance.win(c1, c2);
  return win;
};

export const player2Move = async (
  address: string,
  move: string,
  stake: string
) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const tx = await gameContractInstance.play(move, { value: stake });
  return tx;
};

export const solveGame = async (
  address: string,
  move: string,
  salt: string
) => {
  const signer = await getSigner();
  const gameContractInstance = new ethers.Contract(
    address,
    gameContract.abi,
    signer
  );

  const tx = await gameContractInstance.solve(move, salt);
  return tx;
};
