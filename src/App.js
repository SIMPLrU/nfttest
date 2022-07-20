import "./App.css";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { GiAbstract020, GiManualMeatGrinder } from "react-icons/gi";
import abi from "./abi/abi.json"; // import contract abi
import data from "./data/data.json"; // import data for the various NFTs

function App() {
  // const [account, setAccount] = useState(null);
  const [account, setAccount] = useState(""); // variable to get and set account
  const [provider, setProvider] = useState(null); // variable to get and set provider
  const [nfts, setNfts] = useState(data);

  const balance = async (tokenAddress, nft) => {
  // const balance = async (nft) => {
    const contract = new ethers.Contract(
      // nft.address,
      tokenAddress, // 0xa27D1cEDF3AeCB7c88358caAaF4A27301e1F1a43 - hard coded nft tokenAddress
      abi,
      provider
    );
    const tempBalance = await contract.balanceOf(
      account
      // "0xB7363b923867621707602aBf2b8218e7A6B42DCd" - hard coded wallet address
    );
    const tempNfts = [...nfts.list]; // copy of the nft list
    const tempNft = tempNfts[tempNfts.findIndex((obj) => obj.id == nft.id)]; // exact nft we will manipulate
    tempNft.owner = tempBalance > 0;
    tempNft.count = tempBalance.toString();
    setNfts({
      list: tempNfts,
    });
    console.log(tempBalance.toString());
  };

  // check collection
  const checkCollection = () => {
    data.list.forEach((nft) => {
      balance(nft);
      // console.log(nft);
    });
  };

  // check if metamask is installed; prompt to install if isn't
  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      console.log("Metamask Installed");

      const accounts = await window.ethereum.request({
        //get metamask account
        method: "eth_requestAccounts",
      });

      // set Provider
      const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(tempProvider);

      setAccount(accounts[0]); // set first accounts to SetAccount
      console.log(accounts[0]); // log first account in index
    } else {
      console.log("Please Install Metamask");
    }
  };

  // react hook that refreshes when there is a state change; allows wallet connect to be persistent
  useEffect(() => {
    initConnection();
    // console.log(nfts.list); // test
  }, []);

  useEffect(() => {
    checkCollection();
  }, [account]);

  return (
    <div className="page">
      <div className="header">
        <img
          src={require("./assets/images/logo_opensea.png")}
          className="artIcon"
        />
        <p>
          9/29
          <span>
            {" "}
            <GiAbstract020 style={{ marginLeft: "5px" }} />
          </span>
        </p>
        {account == "" ? ( // if/else statement
          <button onClick={initConnection} className="button">
            CONNECT
          </button>
        ) : (
          <p>...{account.substring(account.length - 8)}</p> //shorten account addres
        )}
      </div>
      {/* <button onClick={balance} className="button">
        GET BALANCE
      </button> */}
      <div className="main">
        {nfts.list.map((nft, index) => {
          return (
            <div key={index} className="card">
              <div style={{ position: "relative" }}>
                <a
                  target={"_blank"}
                  href={`https://opensea.io/collection/${nft.link}`}
                >
                  <img
                    src={require(`./assets/images/logo_opensea.png`)}
                    className="cardImage"
                  />
                </a>
                {/* <GiAbstract020 style={{ marginLeft: "5px" }} />  */}
                <GiAbstract020
                  className="cardImage"
                  style={{ opacity: nft.owner ? 1 : 0.2 }}
                />
                <p className="counter">{nft.count}</p>
              </div>
              <img
                src={require(`./assets/images/${nft.id}.${nft.type}`)}
                className="nftImage"
                style={{ opacity: nft.owner ? 1 : 0.2 }}
              />
              <p className="nftText">{nft.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
