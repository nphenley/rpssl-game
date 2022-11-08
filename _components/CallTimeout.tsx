import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { callTimeout, getPlayer1, getPlayer2 } from "_helpers/onchain";

const CallTimeout = (props: {
  address: string;
  contractAddress: string;
  player: "1" | "2";
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [error, setError] = useState("");
  const [otherPlayer, setOtherPlayer] = useState("");
  const [timeout, setTimeout] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.player === "1") checkPlayer2();
    if (props.player === "2") checkPlayer1();
  });

  const checkPlayer1 = async () => {
    const player1 = await getPlayer1(props.contractAddress);
    setOtherPlayer(player1);
  };
  const checkPlayer2 = async () => {
    const player2 = await getPlayer2(props.contractAddress);
    setOtherPlayer(player2);
  };

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const tx = await callTimeout(props.contractAddress, props.player);
      await tx.wait(1);
      setLoading(false);
      setTimeout(true);
      setError("");
    } catch (e: any) {
      setLoading(false);
      setError(
        "Something went wrong. Make sure you have enough ETH to make this transaction and that 5 minutes have passed since your move."
      );
    }
  };

  const timeoutInput = (
    <div className={styles.inputContainer}>
      <div>
        You are player {props.player}. If your opponent hasn't played in the
        alotted 5 minutes, you can end the game and receive a refund of your
        stake. Your opponent is {otherPlayer}.
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex justify-center w-full h-12 gap-3"
      >
        <button className="px-8 border border-gray-300" type="submit">
          Call Timeout
        </button>
      </form>
    </div>
  );

  const loadingSpinner = <div className="lds-dual-ring" />;

  const loadingMessage = (
    <div className="flex flex-col items-center">
      Calling timeout...
      {loadingSpinner}
    </div>
  );

  const timeoutMessage = (
    <div className="mx-auto">
      You have successfully called timeout and got a refund of your stake.
    </div>
  );

  const errorMessage = <div className="text-red-500">{error}</div>;

  return (
    <div className={styles.container}>
      {timeoutInput}
      {error ? errorMessage : null}
      {loading ? loadingMessage : null}
      {timeout ? timeoutMessage : null}
    </div>
  );
};

const styles = {
  container: "flex flex-col gap-2 mb-8",
  inputContainer: "flex flex-col items-center gap-3",
};

export default CallTimeout;
