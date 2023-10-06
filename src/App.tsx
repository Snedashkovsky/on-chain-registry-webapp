import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
// import { StargateClient } from "@cosmjs/stargate";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import Header from "./components/Header/Header";

const NODE_RPC_URLS = {
  bostrom: "https://rpc.bostrom.cybernode.ai:443",
  localbostrom: "http://localhost:26657",
  "osmosis-testnet": "https://osmosis-testnet-rpc.polkachu.com:443",
};
// const NODE_LCD_URLS = {
//   bostrom: "https://lcd.bostrom.cybernode.ai",
//   localbostrom: "http://localhost:1317",
//   "osmosis-testnet": "https://osmosis-testnet-api.polkachu.com",
// };
const CONTRACT_ADDRESSES = {
  bostrom: "bostrom1w33tanvadg6fw04suylew9akcagcwngmkvns476wwu40fpq36pms92re6u",
  localbostrom:
    "bostrom1l2rs0hxzfy343z8n6punpj9gwzrsq644nzzls6dql52jjj2nxncqjn5vg3",
  "osmosis-testnet":
    "osmo1nwesd2xe6cnvtpqd29xg7qeznlm65x02lfjfg20wlvkdze20hcxsftxtzz",
};

function App() {
  // const [client, setClient] = useState<StargateClient>();
  const [data, setData] = useState<any>();

  useEffect(() => {
    connectStargate();
  }, []);

  const connectStargate = async () => {
    try {
      // const stargateClient = await StargateClient.connect(
      //   // "https://rpc.bostrom.cybernode.ai:443"
      //   "https://osmosis-testnet-rpc.polkachu.com:443"
      // );

      const client = await CosmWasmClient.connect(
        NODE_RPC_URLS["osmosis-testnet"]
      );

      const data = await client.queryContractSmart(
        CONTRACT_ADDRESSES["osmosis-testnet"],
        {
          get_assets_by_chain: {
            chain_name: "osmosis",
            limit: 4,
            start_after_base:
              "ibc/FF6F4774ABC2478832A6D6681DB9A7A8DDC4485212A8AED84642EFCD63C748A9",
          },
        }
      );

      setData(data);

      // setClient(stargateClient);
      // console.log(
      //   "CosmJS Stargate Connected @",
      //   await stargateClient.getChainId()
      // );
    } catch (error) {
      console.error("Error connecting to Stargate:", error);
    }
  };

  return (
    <div className={styles.app}>
      <Header />

      {data ? (
        <div className={styles.main}>
          <p>Chain: {data.chain_name}</p>

          {data.assets.map((asset: any) => {
            return <div>{JSON.stringify(asset)}</div>;
          })}
        </div>
      ) : (
        "Loading..."
      )}

      <footer>footer</footer>
    </div>
  );
}

export default App;
