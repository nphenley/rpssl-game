import { BigNumber, ethers } from "ethers";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  getBalance,
  getPlayer2,
  getStake,
  player2Move,
} from "_helpers/onchain";

const Player2 = (props: { address: string; contractAddress: string }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<BigNumber>();
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [stake, setStake] = useState<BigNumber>();
  const [played, setPlayed] = useState(false);

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
    await checkStake();
    if (!selectedOption) return setError("Please choose a move.");
    const player2 = await getPlayer2(props.contractAddress);
    if (player2.toLowerCase() !== props.address)
      return setError("This address is not player 2.");
    if (!stake) return;
    if (stake > balance!)
      setError("You do not have enough ETH to return the wager.");
    setError("");
    try {
      setLoading(true);
      const tx = await player2Move(
        props.contractAddress,
        selectedOption,
        stake.toString()
      );
      await tx.wait(1);
      setLoading(false);
      setPlayed(true);
    } catch (e: any) {
      setLoading(false);
      if (e.method === "estimateGas")
        setError("You do not have enough ETH to make a transaction.");
      else setError(e.reason);
    }
  };
  useEffect(() => {
    if (!props.address) return;
    checkBalance();
  }, [props.address]);

  const checkBalance = async () => {
    const balance = await getBalance();
    setBalance(balance);
  };

  const checkStake = async () => {
    try {
      ethers.utils.getAddress(props.contractAddress);
    } catch (e: any) {
      console.log(e);
      console.log(props.contractAddress);
      return setError("The contract address you have entered is invalid.");
    }

    const stake = await getStake(props.contractAddress);
    setStake(stake);
  };

  const errorMessage = <div className="text-red-500">{error}</div>;

  const view = (
    <div className={styles.inputContainer}>
      <div>Please enter your move.</div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center w-full h-12 gap-3"
      >
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

        {stake ? (
          <button className="px-8 border border-gray-300" type="submit">
            Play
          </button>
        ) : (
          <button
            type="button"
            onClick={checkStake}
            className="px-8 border border-gray-300"
          >
            Check Stake
          </button>
        )}
      </form>

      {stake ? (
        <div>
          You will have to wager {ethers.utils.formatEther(stake).toString()}
          ETH
        </div>
      ) : null}
      {errors.contractAddress?.type === "required" && (
        <p className="text-red-500" role="alert">
          Address is required.
        </p>
      )}
    </div>
  );
  const loadingSpinner = <div className="lds-dual-ring" />;

  const loadingMessage = (
    <div className="flex flex-col items-center">
      Playing move...
      {loadingSpinner}
    </div>
  );

  const playedMessage = (
    <div className="mx-auto">
      You have successfully played your move, tell your opponent to end the game
      and determine the winner.
    </div>
  );

  return (
    <div className="container">
      {view}
      {error ? errorMessage : null}
      {loading ? loadingMessage : null}
      {played ? playedMessage : null}
    </div>
  );
};

const styles = {
  container: "flex flex-col gap-2 mb-8",
  inputContainer: "flex flex-col items-center gap-3",
};

export default Player2;
