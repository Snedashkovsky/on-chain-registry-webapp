import React, { useEffect, useState } from "react";
import styles from "./App.module.scss";
// import { StargateClient } from "@cosmjs/stargate";
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

    render: (text) => <a>{text || "-"}</a>,
  },
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
    render: (text) => <a>{text || "-"}</a>,
  },
  {
    title: "Denom",
    dataIndex: "base",
    key: "denom",
    render: (text) =>
      text.includes("ibc/") || text.includes("cosmosvaloper") ? (
        <Tooltip title={text}>
          <a href="">ibc...</a>
        </Tooltip>
      ) : (
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
  {
    title: "Supply",
    dataIndex: "supply",
    key: "supply",
    defaultSortOrder: "descend",
    // @ts-ignore
    sorter: (a, b) => a.supply - b.supply,
    render: (text) => (
      <a
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {Number(text).toLocaleString().replaceAll(",", " ")}
      </a>
    ),
  },
  {
    title: "Total supply",
    dataIndex: "total",
    key: "total",
    defaultSortOrder: "descend",
    // @ts-ignore
    sorter: (a, b) => a.total - b.total,
    render: (text) => (
      <a
        style={{
          whiteSpace: "nowrap",
        }}
      >
        {text == 0 ? "-" : Number(text).toLocaleString().replaceAll(",", " ")}
      </a>
    ),
  },
];

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

interface Trace {
  trace_type: string;
  counterparty: {
    base_denom: string;
    chain_id: string;
    port: string | null;
    channel_id: string;
    chain_name: string;
    contract: string | null;
    base_supply: string;
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
  base_supply: string | null;
}

interface Asset {
  chain_name: string;
  chain_id: string;
  base: string;
  type_asset: string;
  supply: string;
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
  // const [client, setClient] = useState<StargateClient>();
  const [data, setData] = useState<any>();

  const [chain, setChain] = useState("cosmoshub");
  const [limit, setLimit] = useState(50);
  const [error, seterror] = useState(null);
  const [loading, setLoading] = useState(false);

  const [filters, setfilters] = useState<any>([]);

  useEffect(() => {
    connectStargate();
  }, [chain, limit]);

  const connectStargate = async () => {
    try {
      // const stargateClient = await StargateClient.connect(
      //   // "https://rpc.bostrom.cybernode.ai:443"
      //   "https://osmosis-testnet-rpc.polkachu.com:443"
      // );

      setLoading(true);

      const client = await CosmWasmClient.connect(
        // NODE_RPC_URLS["osmosis-testnet"]
        // NODE_RPC_URLS["osmosis-testnet"]
        "https://rpc-falcron.pion-1.ntrn.tech:443"
      );

      const data = (await client.queryContractSmart(
        // CONTRACT_ADDRESSES["osmosis-testnet"],
        // CONTRACT_ADDRESSES["osmosis-testnet"],
        "neutron10v5u2pqce59j0sm6nzv6a42qfus2rdcsxr5y2g27qawulqdss57qjsta8y",
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
          base: asset.base,
          supply: asset.supply,
          type: asset.type_asset,
          // @ts-ignore
          total: asset.traces?.[0]?.counterparty?.base_supply || 0,
        };
      });

      // console.log(data);

      setData(nData);

      // setClient(stargateClient);
      // console.log(
      //   "CosmJS Stargate Connected @",
      //   await stargateClient.getChainId()
      // );
    } catch (error) {
      console.error("Error connecting to Stargate:", error);
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

            // { value: "osmo", label: "Osmosis testnet" },
            // { value: "bostrom", label: "Bostrom" },
            // { value: "Yiminghe", label: "yiminghe" },
            // { value: "disabled", label: "Disabled", disabled: true },
          }
        />

        <Select
          value={limit.toString()}
          onChange={handleChange2}
          style={{ width: 120 }}
          options={[10, 20, 50, 100, 300, 450].map((i) => {
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
            options={["ics20", "sdk.coin", "pool"].map((item) => {
              return {
                value: item,
                label: item,
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
        2023 Hackmos{" "}
        <a href="https://github.com/Snedashkovsky/hackmos" target="_blank">
          GitHub
        </a>
      </footer>
    </div>
  );
}

export default App;
