import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { ethers } from "ethers";
import Select from "react-select";
import { ContractFactory } from "ethers";
import contract from "contract.json";
import crypto, { randomBytes } from "crypto";
const bytecode = contract.bytecode;
const abi = contract.abi;

import { getBalance, getHash, getSigner } from "_helpers/onchain";
import BN from "bn.js";

const CreateGame = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [salt, setSalt] = useState("");
  const [contract, setContract] = useState("");
  const [signer, setSigner] = useState<any>();

  useEffect(() => {
    checkBalance();
    checkSigner();
  }, []);

  const checkBalance = async () => {
    const balance = await getBalance();
    setBalance(Number(ethers.utils.formatEther(balance)));
  };

  const checkSigner = async () => {
    const signer = await getSigner();
    setSigner(signer);
  };

  const options = [
    { value: "1", label: "Rock" },
    { value: "2", label: "Paper" },
    { value: "3", label: "Scissors" },
    { value: "4", label: "Spock" },
    { value: "5", label: "Lizard" },
  ];

  const handleTypeSelect = (e: any) => {
    setSelectedOption(e.value);
  };
  const onSubmit = async (data: any) => {
    console.log(data, selectedOption);
    if (!data.address || !data.wager || !selectedOption)
      return setError("Please fill all 3 inputs.");
    try {
      ethers.utils.getAddress(data.address);
    } catch (e: any) {
      return setError("The opponent address you have entered is invalid.");
    }
    if (!Number(data.wager))
      return setError("The wager you have entered is invalid.");
    if (Number(data.wager) > balance!)
      return setError("Your wager exceeds your balance.");

    setError("");
    const value = randomBytes(32);
    const bn = new BN(value.toString("hex"), 16);
    console.log(bn.toString());
    setSalt(bn.toString());
    const hashedMove = await getHash(selectedOption, bn.toString());
    console.log(hashedMove);
    console.log((Number(data.wager) * 1e18).toString());
    deployContract(
      hashedMove,
      data.address,
      (Number(data.wager) * 1e18).toString()
    );
  };

  const deployContract = async (
    hashedMove: string,
    player2: string,
    stake: string
  ) => {
    const factory = new ContractFactory(abi, bytecode, signer);
    console.log(factory);
    const contract = await factory.deploy(hashedMove, player2, {
      value: stake,
    });
    setLoading(true);
    console.log(contract.address);
    console.log(contract.deployTransaction);
    await contract.deployed();
    setDeployed(true);
    setContract(contract.address);
    setLoading(false);
  };

  const loadingSpinner = <div className="lds-dual-ring" />;

  const errorMessage = <div className="text-red-500">{error}</div>;

  const connectedWalletView = (
    <div className={styles.inputContainer}>
      <div>
        Please input your chosen opponent's address and bet amount. Then, click
        the "Challenge" button to start.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center w-full h-12 gap-3"
      >
        <input
          {...register("address", { required: true })}
          className="w-1/2 h-full px-6 border border-gray-300 focus:outline-none"
          placeholder="Opponent Address"
          aria-invalid={errors.address ? "true" : "false"}
        />

        <input
          {...register("wager", { required: true })}
          className="w-1/6 h-full px-6 border border-gray-300 focus:outline-none"
          placeholder="Wager in ETH"
          aria-invalid={errors.wager ? "true" : "false"}
        />
        <div className="p-1">
          <Controller
            control={control}
            name="move"
            render={() => (
              <Select
                value={options.filter(function (option) {
                  return option.value === selectedOption;
                })}
                onChange={handleTypeSelect}
                options={options}
                name="move"
              />
            )}
          />
        </div>

        <button className="px-8 border border-gray-300" type="submit">
          Challenge
        </button>
      </form>
      {errors.address?.type === "required" && (
        <p className="text-red-500" role="alert">
          Address is required.
        </p>
      )}
      {errors.wager?.type === "required" && (
        <p className="text-red-500" role="alert">
          Wager is required.
        </p>
      )}
      {errors.move?.type === "required" && (
        <p className="text-red-500" role="alert">
          Move is required.
        </p>
      )}
    </div>
  );

  const loadingMessage = (
    <div className="flex flex-col items-center">
      Deploying contract...
      {loadingSpinner}
    </div>
  );

  const deployedView = (
    <div className="flex flex-col items-center">
      Please tell your opponent to enter this
      <p className="font-bold">{contract}</p> into the "Enter Contract" section.
      Make sure to safely store your salt {salt} and your chosen move.
    </div>
  );

  return (
    <div className={styles.container}>
      {connectedWalletView}
      {loading ? loadingMessage : null}
      {deployed ? deployedView : null}
      {error ? errorMessage : null}
    </div>
  );
};

const styles = {
  container: "flex flex-col gap-2 mb-8",
  inputContainer: "flex flex-col items-center gap-3",
};

export default CreateGame;
