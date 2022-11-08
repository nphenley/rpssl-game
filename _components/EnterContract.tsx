import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  getBalance,
  getPlayer1,
  getPlayer2,
  getStake,
  player2Move,
} from "_helpers/onchain";
import CallTimeout from "./CallTimeout";
import EndGame from "./EndGame";
import Player2 from "./Player2";

const EnterContract = (props: { address: string }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState("");
  const [whichPlayer, setWhichPlayer] = useState(0);

  const onSubmit = async (data: any) => {
    if (!data.contractAddress) return setError("Please fill both inputs.");
    try {
      ethers.utils.getAddress(data.contractAddress);
    } catch (e: any) {
      console.log(e);
      return setError("The contract address you have entered is invalid.");
    }
    setContract(data.contractAddress);
    const player1 = await getPlayer1(data.contractAddress);
    if (player1.toLowerCase() === props.address) return setWhichPlayer(1);
    const player2 = await getPlayer2(data.contractAddress);
    if (player2.toLowerCase() === props.address) return setWhichPlayer(2);

    return setWhichPlayer(-1);
  };

  const errorMessage = <div className="text-red-500">{error}</div>;

  const view = (
    <div>
      <div className={styles.sectionContainer}>
        <div>Please enter the contract address of your game.</div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex justify-center w-full h-12 gap-3"
        >
          <input
            {...register("contractAddress", { required: true })}
            className="w-1/2 h-full px-6 border border-gray-300 focus:outline-none"
            placeholder="Contract Address"
            onChange={(e: any) => {
              setContract(e.target.value);
            }}
            aria-invalid={errors.contractAddress ? "true" : "false"}
          />

          <button className="px-8 border border-gray-300" type="submit">
            Enter
          </button>
        </form>
      </div>
      {whichPlayer === 1 ? (
        <div>
          <div className={styles.sectionContainer}>
            <div className="font-bold">Call Timeout</div>

            <CallTimeout
              address={props.address}
              contractAddress={contract}
              player={"1"}
            />
          </div>
          <div className={styles.sectionContainer}>
            <div className="font-bold">End Game</div>

            <EndGame address={props.address} contractAddress={contract} />
          </div>
        </div>
      ) : whichPlayer === 2 ? (
        <>
          <div className={styles.sectionContainer}>
            <div className="font-bold">Player 2</div>

            <Player2 address={props.address} contractAddress={contract} />
          </div>
          <div className={styles.sectionContainer}>
            <div className="font-bold">Call Timeout</div>

            <CallTimeout
              address={props.address}
              contractAddress={contract}
              player={"2"}
            />
          </div>
        </>
      ) : whichPlayer === -1 ? (
        <div>This address is not part of this game.</div>
      ) : null}

      {errors.contractAddress?.type === "required" && (
        <p className="text-red-500" role="alert">
          Address is required.
        </p>
      )}
    </div>
  );

  return (
    <div className="container">
      {view}
      {error ? errorMessage : null}
    </div>
  );
};

const styles = {
  container: "flex flex-col gap-2 mb-8",
  inputContainer: "flex flex-col items-center gap-3",
  sectionContainer: "flex flex-col mt-7 gap-6 pb-8 border-b-[1px]",
};

export default EnterContract;
