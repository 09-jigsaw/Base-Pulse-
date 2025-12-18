// app.base-pulse.ts
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { createPublicClient, http, formatEther, isAddress } from "viem";
import { base, baseSepolia } from "viem/chains";

type Net = {
  chain: typeof base;
  chainId: number;
  rpc: string;
  explorer: string;
  label: string;
};

const NETS: Record<"mainnet" | "sepolia", Net> = {
  mainnet: {
    chain: base,
    chainId: 8453,
    rpc: "https://mainnet.base.org",
    explorer: "https://basescan.org",
    label: "Base Mainnet",
  },
  sepolia: {
    chain: baseSepolia,
    chainId: 84532,
    rpc: "https://sepolia.base.org",
    explorer: "https://sepolia.basescan.org",
    label: "Base Sepolia",
  },
};

const APP = {
  name: "Base Pulse (Built for Base)",
  logo: "https://base.org/favicon.ico",
};

let active: Net = NETS.sepolia;

function text(lines: string[]) {
  document.body.innerText = lines.join("\n");
}

function mkButton(label: string, onClick: () => void) {
  const b = document.createElement("button");
  b.innerText = label;
  b.style.marginRight = "10px";
  b.style.padding = "8px 10px";
  b.style.borderRadius = "10px";
  b.style.border = "1px solid rgba(0,0,0,0.15)";
  b.style.background = "white";
  b.style.cursor = "pointer";
  b.onclick = onClick;
  return b;
}

function mkInput(placeholder: string) {
  const i = document.createElement("input");
  i.placeholder = placeholder;
  i.style.marginRight = "10px";
  i.style.padding = "8px 10px";
  i.style.borderRadius = "10px";
  i.style.border = "1px solid rgba(0,0,0,0.15)";
  i.style.minWidth = "280px";
  return i;
}

async function connectProvider() {
  const sdk = new CoinbaseWalletSDK({ appName: APP.name, appLogoUrl: APP.logo });
  const provider = sdk.makeWeb3Provider(active.rpc, active.chainId);

  const accounts = (await provider.request({ method: "eth_requestAccounts" })) as string[];
  const address = accounts?.[0];
  if (!address) throw new Error("No address returned from eth_requestAccounts.");

  const chainIdHex = (await provider.request({ method: "eth_chainId" })) as string;
  const chainId = parseInt(chainIdHex, 16);

  return { provider, address, chainId };
}

function publicClient() {
  return createPublicClient({ chain: active.chain, transport: http(active.rpc) });
}

async function readBasics(address: string) {
  const client = publicClient();
  const [block, balance] = await Promise.all([
    client.getBlockNumber(),
    client.getBalance({ address: address as `0x${string}` }),
  ]);
  return { block, balance };
}

async function readGasSnapshot() {
  const client = publicClient();
  const [latestBlock, feeData] = await Promise.all([client.getBlock(), client.estimateFeesPerGas()]);
  return { latestBlock, feeData };
}

async function readAddressBalance(address: string) {
  const client = publicClient();
  const balance = await client.getBalance({ address: address as `0x${string}` });
  return balance;
}

async function run() {
  text([
    "Base Pulse (Built for Base)",
    "",
    `Active network: ${active.label}`,
    `chainId (target): ${active.chainId}`,
    "",
    "Loading UI…",
  ]);

  const root = document.createElement("div");
  root.style.fontFamily = "ui-sans-serif, system-ui";
  root.style.maxWidth = "1100px";
  root.style.margin = "28px auto";
  root.style.padding = "0 16px";

  const header = document.createElement("div");
  header.style.marginBottom = "12px";

  const title = document.createElement("h1");
  title.innerText = APP.name;
  title.style.margin = "0 0 6px 0";
  title.style.fontSize = "22px";

  const sub = document.createElement("div");
  sub.innerText = "Wallet connect + Base chain validation + read-only network pulse (block, balance, fee snapshot).";
  sub.style.opacity = "0.8";

  header.appendChild(title);
  header.appendChild(sub);

  const controls = document.createElement("div");
  controls.style.display = "flex";
  controls.style.flexWrap = "wrap";
  controls.style.gap = "10px";
  controls.style.margin = "12px 0";

  const out = document.createElement("pre");
  out.style.whiteSpace = "pre-wrap";
  out.style.wordBreak = "break-word";
  out.style.background = "#0b0f1a";
  out.style.color = "#dbe7ff";
  out.style.padding = "14px";
  out.style.borderRadius = "14px";
  out.style.border = "1px solid rgba(255,255,255,0.12)";
  out.style.minHeight = "320px";
  out.innerText = "Ready. Connect to start.";

  const toggleBtn = mkButton("Toggle Network (Base ↔ Base Sepolia)", () => {
    active = active.chainId === NETS.sepolia.chainId ? NETS.mainnet : NETS.sepolia;
    out.innerText = `Network toggled. Active target: ${active.label} (chainId ${active.chainId}). Connect again.`;
    connectBtn.disabled = false;
    pulseBtn.disabled = true;
    addrBtn.disabled = true;
  });

  const connectBtn = mkButton("Connect Wallet", async () => {
    try {
      out.innerText = "Connecting…";
      const s = await connectProvider();
      const basics = await readBasics(s.address);

      session = s;
      pulseBtn.disabled = false;
      addrBtn.disabled = false;

      out.innerText = [
        "Connected",
        `Network: ${active.label}`,
        `chainId (wallet): ${s.chainId}`,
        `Address: ${s.address}`,
        `ETH balance: ${formatEther(basics.balance)} ETH`,
        `Latest block: ${basics.block}`,
        `Explorer: ${active.explorer}/address/${s.address}`,
        "",
        "Next: Run Pulse Snapshot or check a custom address balance.",
      ].join("\n");
    } catch (e: any) {
      out.innerText = `Error (Connect): ${e?.message ?? String(e)}`;
    }
  });

  const pulseBtn = mkButton("Pulse Snapshot", async () => {
    try {
      if (!session) throw new Error("Connect first.");
      out.innerText = "Fetching pulse snapshot…";
      const { latestBlock, feeData } = await readGasSnapshot();

      out.innerText = [
        "Pulse Snapshot (read-only)",
        `Network: ${active.label}`,
        `chainId: ${active.chainId}`,
        "",
        `Block number: ${latestBlock.number}`,
        `Block timestamp: ${latestBlock.timestamp}`,
        "",
        "Fee snapshot (estimateFeesPerGas):",
        `maxFeePerGas: ${feeData.maxFeePerGas?.toString() ?? "n/a"}`,
        `maxPriorityFeePerGas: ${feeData.maxPriorityFeePerGas?.toString() ?? "n/a"}`,
        "",
        `Verifier (explorer): ${active.explorer}/block/${latestBlock.number}`,
      ].join("\n");
    } catch (e: any) {
      out.innerText = `Error (Pulse): ${e?.message ?? String(e)}`;
    }
  });

  const addressInput = mkInput("Check balance for address (0x...)");
  const addrBtn = mkButton("Check Address Balance", async () => {
    try {
      const value = addressInput.value.trim();
      const candidate = value || session?.address || "";
      if (!candidate) throw new Error("Provide an address or connect first.");
      if (!isAddress(candidate)) throw new Error("Invalid address format.");

      out.innerText = "Reading balance…";
      const bal = await readAddressBalance(candidate);
      out.innerText = [
        "Address Balance (read-only)",
        `Network: ${active.label}`,
        `chainId: ${active.chainId}`,
        "",
        `Address: ${candidate}`,
        `ETH balance: ${formatEther(bal)} ETH`,
        `Explorer: ${active.explorer}/address/${candidate}`,
      ].join("\n");
    } catch (e: any) {
      out.innerText = `Error (Balance): ${e?.message ?? String(e)}`;
    }
  });

  let session: { provider: any; address: string; chainId: number } | null = null;
  pulseBtn.disabled = true;
  addrBtn.disabled = true;

  controls.appendChild(connectBtn);
  controls.appendChild(toggleBtn);
  controls.appendChild(pulseBtn);
  controls.appendChild(addressInput);
  controls.appendChild(addrBtn);

  root.innerHTML = "";
  root.appendChild(header);
  root.appendChild(controls);
  root.appendChild(out);

  document.body.innerHTML = "";
  document.body.appendChild(root);

  out.innerText = [
    "Ready.",
    `Active target: ${active.label} (chainId ${active.chainId}).`,
    "Connect wallet to print Base explorer links and fetch read-only network state.",
  ].join("\n");
}

run();
