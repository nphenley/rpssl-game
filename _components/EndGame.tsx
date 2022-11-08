import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import {
  getBalance,
  getPlayer2Move,
  getWinner,
  solveGame,
} from "_helpers/onchain";

const EndGame = (props: { address: string; contractAddress: string }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [selectedOption, setSelectedOption] = useState("none");
  const [loading, setLoading] = useState(false);
  const [ended, setEnded] = useState(false);
  const [c2, setC2] = useState("");
  const [result, setResult] = useState<"p1" | "p2" | "tie">();

  useEffect(() => {
    checkC2();
  }, []);

  const checkC2 = async () => {
    setC2(await getPlayer2Move(props.contractAddress));
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const tx = await solveGame(
        props.contractAddress,
        selectedOption,
        data.salt
      );
      const winner = await getWinner(props.contractAddress, selectedOption, c2);
      winner ? setResult("p1") : setResult("p2");
      if (selectedOption === c2) setResult("tie");
      await tx.wait(1);
      setLoading(false);
      setEnded(true);
    } catch (e: any) {
      setLoading(false);
      if (e.method === "estimateGas")
        return setError("You do not have enough gas to transact.");
      console.log(e);
    }
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

  const view = (
    <div className={styles.inputContainer}>
      <div>
        Please enter the salt and the move you originally played when
        challenging your opponent.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center w-full h-12 gap-3"
      >
        <input
          {...register("salt", { required: true })}
          className="w-1/6 h-full px-6 border border-gray-300 focus:outline-none"
          placeholder="Your salt"
          aria-invalid={errors.salt ? "true" : "false"}
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
          End
        </button>
      </form>
    </div>
  );
  const loadingSpinner = <div className="lds-dual-ring" />;

  const loadingMessage = (
    <div className="flex flex-col items-center">
      Ending game...
      {loadingSpinner}
    </div>
  );

  const endMessage = (
    <div className="mx-auto">
      The game has ended!
      {result === "p1"
        ? " Congratulations, you won!"
        : result === "p2"
        ? " Unfortunately, you lost."
        : " The game resulted in a tie."}
    </div>
  );

  return (
    <div className={styles.container}>
      {view}
      {loading ? loadingMessage : null}
      {ended ? endMessage : null}
    </div>
  );
};

const styles = {
  container: "flex flex-col gap-2 mb-8",
  inputContainer: "flex flex-col items-center gap-3",
};

export default EndGame;
