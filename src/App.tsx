import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import Header from "./components/Header/Header";
import { Select, Space, Table, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";

interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
  tags: string[];
}

const CHAINS = [
  "8ball",
  "acrechain",
  "agoric",
  "aioz",
  "akash",
  "archway",
  "arkh",
  "assetmantle",
  "aura",
  "axelar",
  "bandchain",
  "beezee",
  "bitcanna",
  "bitsong",
  "bluzelle",
  "bostrom",
  "canto",
  "carbon",
  "chain4energy",
  "cheqd",
  "chihuahua",
  "chimba",
  "chronicnetwork",
  "comdex",
  "commercionetwork",
  "composable",
  "coreum",
  "cosmoshub",
  "crescent",
  "cronos",
  "cryptoorgchain",
  "cudos",
  "decentr",
  "desmos",
  "dig",
  "doravota",
  "dyson",
  "echelon",
  "empowerchain",
  "ethos",
  "evmos",
  "fetchhub",
  "firmachain",
  "fxcore",
  "gateway",
  "genesisl1",
  "gitopia",
  "gravitybridge",
  "haqq",
  "highbury",
  "humans",
  "impacthub",
  "imversed",
  "injective",
  "irisnet",
  "jackal",
  "juno",
  "kava",
  "kichain",
  "konstellation",
  "kujira",
  "kyve",
  "lambda",
  "likecoin",
  "logos",
  "loyal",
  "lumenx",
  "lumnetwork",
  "mars",
  "mayachain",
  "medasdigital",
  "meme",
  "migaloo",
  "mun",
  "mythos",
  "neutron",
  "noble",
  "nois",
  "nolus",
  "nyx",
  "odin",
  "omniflixhub",
  "onomy",
  "oraichain",
  "osmosis",
  "panacea",
  "passage",
  "persistence",
  "planq",
  "point",
  "provenance",
  "quasar",
  "quicksilver",
  "qwoyn",
  "realio",
  "rebus",
  "regen",
  "rizon",
  "secretnetwork",
  "sei",
  "sentinel",
  "sge",
  "shareledger",
  "shentu",
  "sifchain",
  "sommelier",
  "space-pussy",
  "stafihub",
  "stargaze",
  "starname",
  "stride",
  "tenet",
  "teritori",
  "terra",
  "terra2",
  "tgrade",
  "umee",
  "unification",
  "ununifi",
  "uptick",
  "vidulum",
  "xpla",
];

const columns: ColumnsType<DataType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    defaultSortOrder: "descend",
    // @ts-ignore
    sorter: (a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";

      if (aName < bName) return -1;
      if (aName > bName) return 1;

      return 0;
    },

    render: (text) => <p>{text || "-"}</p>,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    sorter: (a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";

      if (aName < bName) return -1;
      if (aName > bName) return 1;

      return 0;
    },
    render: (text) => <p>{text || "-"}</p>,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    sorter: (a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";

      if (aName < bName) return -1;
      if (aName > bName) return 1;

      return 0;
    },
    render: (text) => <p>{text || "-"}</p>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    sorter: (a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";

      if (aName < bName) return -1;
      if (aName > bName) return 1;

      return 0;
    },
    render: (text) => <p>{text || "-"}</p>,
  },
  {
    title: "Denom",
    dataIndex: "base",
    key: "denom",
    sorter: (a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";

      if (aName < bName) return -1;
      if (aName > bName) return 1;

      return 0;
    },
    render: (text) =>
      (
        <a
          style={
            {
              // maxWidth: 200,
              // display: "block",
              // overflow: "hidden",
            }
          }
        >
          {text}
        </a>
      ),
  },
];

const NODE_RPC_URLS: {[key: string]: any} = {
  bostrom: "https://rpc.bostrom.cybernode.ai:443",
  localbostrom: "http://localhost:26657",
  "osmosis-testnet": "https://osmosis-testnet-rpc.polkachu.com:443",
  "neutron-testnet":"https://rpc-falcron.pion-1.ntrn.tech:443",
};
// const NODE_LCD_URLS: {[key: string]: any} = {
//   bostrom: "https://lcd.bostrom.cybernode.ai",
//   localbostrom: "http://localhost:1317",
//   "osmosis-testnet": "https://osmosis-testnet-api.polkachu.com",
// };
const CONTRACT_ADDRESSES: {[key: string]: any} = {
  bostrom: "bostrom1w33tanvadg6fw04suylew9akcagcwngmkvns476wwu40fpq36pms92re6u",
  localbostrom: "bostrom1l2rs0hxzfy343z8n6punpj9gwzrsq644nzzls6dql52jjj2nxncqjn5vg3",
  "osmosis-testnet": "osmo1nwesd2xe6cnvtpqd29xg7qeznlm65x02lfjfg20wlvkdze20hcxsftxtzz",
  "neutron-testnet": "neutron10v5u2pqce59j0sm6nzv6a42qfus2rdcsxr5y2g27qawulqdss57qjsta8y",
};

interface Trace {
  trace_type: string;
  counterparty: {
    base_denom: string;
    chain_id: string;
    port: string | null;
    channel_id: string;
    chain_name: string;
    contract: string | null;
  };
  chain: {
    port: string | null;
    channel_id: string;
    path: string;
  };
  provider: string | null;
}

interface IBCInfo {
  source_channel: string;
  dst_channel: string;
  source_denom: string;
}

interface Asset {
  chain_name: string;
  chain_id: string;
  base: string;
  type_asset: string;
  description: string | null;
  denom_units:
    | {
        denom: string;
        exponent: number;
        aliases: string[];
      }[]
    | null;
  address: string | null;
  admin: string | null;
  name: string | null;
  display: string | null;
  symbol: string | null;
  traces: Trace[] | null;
  ibc: IBCInfo | null;
  logo_uris: string[] | null;
  images: string[] | null;
  coingecko_id: string | null;
  keywords: string[] | null;
}

interface AssetData {
  chain_name: string;
  assets: Asset[];
}

function App() {
  const [data, setData] = useState<any>();

  const [chain_source] = useState("bostrom")
  const [chain, setChain] = useState("bostrom");
  const [limit, setLimit] = useState(750);
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setfilters] = useState<any>([]);

  useEffect(() => {
    connectContract();
  }, [chain, limit]);

  const connectContract = async () => {
    try {
      setLoading(true);

      const client = await CosmWasmClient.connect(
        NODE_RPC_URLS[chain_source]
      );

      const data = (await client.queryContractSmart(
        CONTRACT_ADDRESSES[chain_source],
        {
          get_assets_by_chain: {
            chain_name: chain,
            limit: limit,
            // start_after_base:
            // "ibc/FF6F4774ABC2478832A6D6681DB9A7A8DDC4485212A8AED84642EFCD63C748A9",
          },
        }
      )) as AssetData;

      const nData = data.assets.map((asset: Asset) => {
        console.log(asset.type_asset);

        return {
          key: asset.base,
          name: asset.name,
          symbol: asset.symbol || asset.display,
          description: asset.description,
          base: asset.base,
          type: asset.type_asset,
          // @ts-ignore
        };
      });

      setData(nData);

    } catch (error) {
      console.error("Error connecting to Contract:", error);
      // @ts-ignore
      seterror(error);
    }
    setLoading(false);
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);

    setChain(value);
  };

  const handleChange2 = (value: string) => {
    console.log(`selected ${value}`);

    setLimit(Number(value));
  };

  // Filter `option.label` match the user type `input`
  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  // console.log(data);

  const handleChange3 = (value: string[]) => {
    console.log(`selected ${value}`);
    setfilters(value);
  };

  console.log(data);

  return (
    <div className={styles.app}>
      <Header />

      <div className={styles.filters}>
        <Select
          value={chain}
          style={{ width: 220 }}
          showSearch
          filterOption={filterOption}
          onChange={handleChange}
          options={
            CHAINS.map((chain) => {
              return {
                value: chain,
                label: chain.toUpperCase(),
              };
            })
          }
        />

        <Select
          value={limit.toString()}
          onChange={handleChange2}
          style={{ width: 120 }}
          options={[10, 20, 50, 100, 300, 500, 750, 1000].map((i) => {
            return {
              value: i,
              label: i,
            };
          })}
        />

        {data?.length > 0 && (
          <Select
            mode="multiple"
            allowClear
            style={{ width: 200 }}
            placeholder="Select asset type"
            // defaultValue={[]}
            onChange={handleChange3}
            options={[["sdk.coin", "Native"], ["ics20", "IBC"], ["pool", "LP Tokens"], ["cw20", "CW20"], ["erc20", "ERC20"], ["factory", "Token Factory"]].map((item) => {
              return {
                value: item[0],
                label: item[1],
              };
            })}
          />
        )}
      </div>

      {data?.length ? (
        <div className={styles.main}>
          <div className={styles.info}>
            <p>
              Chain: <strong>{chain}</strong>
            </p>

            <p>
              Total: <strong>{data.length}</strong>
            </p>
          </div>

          {/* <p>Chain: {data.chain_name}</p>

          {data.assets.map((asset: any) => {
            return <div>{JSON.stringify(asset)}</div>;
          })} */}

          <Table
            bordered
            columns={columns}
            dataSource={data.filter((item: any) =>
              filters.length > 0 ? filters.includes(item.type) : true
            )}
            pagination={false}
          />
        </div>
      ) : loading ? (
        <p
          style={{
            textAlign: "center",
          }}
        >
          {" "}
          Loading...
        </p>
      ) : error ? (
        <p
          style={{
            textAlign: "center",
          }}
        >
          {" "}
          Error loading data
          {/* @ts-ignore */}
          {JSON.stringify(error)}
        </p>
      ) : data?.length === 0 ? (
        <p
          style={{
            textAlign: "center",
          }}
        >
          {" "}
          No data for this chain
        </p>
      ) : (
        <p
          style={{
            textAlign: "center",
          }}
        >
          {" "}
          Select chain
        </p>
      )}

      <footer>
        {/*2023 {" "}*/}
        <a href="https://github.com/Snedashkovsky/on-chain-registry" target="_blank">
          On-Chain Registry
        </a>
      </footer>
    </div>
  );
}

export default App;
