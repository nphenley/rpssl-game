import type { NextPage } from "next";
import StyledHead from "_styled/StyledHead";
import { AiOutlineGithub } from "react-icons/ai";
import CreateGame from "_components/CreateGame";
import CallTimeout from "_components/CallTimeout";
import EndGame from "_components/EndGame";
import Player2 from "_components/Player2";
import { useEffect, useState } from "react";
import {
  checkForConnectedAddresses,
  connectToMetamask,
  initListenerForConnectedAddresses,
} from "_helpers/onchain";
import EnterContract from "_components/EnterContract";

const Index: NextPage = () => {
  const [connectedAddresses, setConnectedAddresses] = useState<string[]>([]);

  useEffect(() => {
    initListenerForConnectedAddresses(setConnectedAddresses);
    checkForConnectedAddresses(setConnectedAddresses);
  }, []);

  const connectWalletView = (
    <div className="flex flex-col">
      <div>Please connect your wallet on the Goerli Testnet.</div>
      <button
        className="w-1/3 px-4 py-3 mx-auto border mt-9"
        onClick={connectToMetamask}
      >
        Connect Wallet
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      <StyledHead title="RPSLS" />
      <div className={styles.contentContainer}>
        <div className="flex items-center justify-between font-bold text-center">
          <div></div>
          <div>Rock Paper Scissors Lizard Spock</div>
          <div className="flex items-center gap-3">
            <a
              target="_blank"
              href="https://www.google.com/url?q=https://github.com/clesaege/RPS/blob/master/RPS.sol&sa=D&source=docs&ust=1667840519974205&usg=AOvVaw2t8zoeIR-XY3aLcNb2xvTT"
            >
              <AiOutlineGithub size={18} />
            </a>
          </div>
        </div>

        <div className={styles.sectionContainer}>
          <div className="flex items-center justify-between font-bold">
            <div>The Game</div>
          </div>
          <div className="flex flex-col gap-4">
            <div>
              The five-weapon expansion of traditional Rock, Paper Scissors is
              "Rock, Paper, Scissors, Spock, Lizard", invented by Sam Kass and
              Karen Bryla, which adds "Spock" and "lizard" to the standard three
              choices. "Spock" is signified with the Star Trek Vulcan salute,
              while "lizard" is shown by forming the hand into a
              sock-puppet-like mouth. Spock smashes scissors and vaporizes rock;
              he is poisoned by lizard and disproved by paper. Lizard poisons
              Spock and eats paper; it is crushed by rock and decapitated by
              scissors.
            </div>
          </div>
        </div>

        {connectedAddresses.length !== 0 ? (
          <>
            <div className={styles.sectionContainer}>
              <div className="font-bold">Create Game</div>
              <CreateGame />
            </div>
            <div>
              <div className="font-bold">Enter Contract</div>
              <EnterContract address={connectedAddresses[0]} />
            </div>
          </>
        ) : (
          <div>{connectWalletView}</div>
        )}
      </div>
    </div>
  );
};

export default Index;

const styles = {
  container:
    "relative flex flex-col items-center min-h-screen font-serif text-sm leading-loose tracking-wider",
  contentContainer: "w-full lg:max-w-screen-lg flex flex-col gap-12 px-6 py-8",
  sectionContainer: "flex flex-col gap-6 pb-8 border-b-[1px]",
};
