export interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  isNative?: boolean
}

export interface ChainInfo {
  id: number
  name: string
  shortName: string
  color: string
  tokens: TokenInfo[]
}

export const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    id: 42161,
    name: 'Arbitrum',
    shortName: 'ARB',
    color: '#12AAFF',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18 },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8 },
      { symbol: 'DAI',  name: 'Dai',          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
    ],
  },
  {
    id: 8453,
    name: 'Base',
    shortName: 'BASE',
    color: '#0052FF',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18 },
      { symbol: 'DAI',  name: 'Dai',          address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18 },
    ],
  },
  {
    id: 10,
    name: 'Optimism',
    shortName: 'OP',
    color: '#FF0420',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18 },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095', decimals: 8 },
      { symbol: 'DAI',  name: 'Dai',          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18 },
    ],
  },
  {
    id: 137,
    name: 'Polygon',
    shortName: 'POL',
    color: '#8247E5',
    tokens: [
      { symbol: 'USDC', name: 'USD Coin',     address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18 },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8 },
      { symbol: 'DAI',  name: 'Dai',          address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18 },
    ],
  },
  {
    id: 324,
    name: 'zkSync Era',
    shortName: 'ZK',
    color: '#8C8DFC',
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',     address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', decimals: 6 },
      { symbol: 'USDT',   name: 'Tether USD',   address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C', decimals: 6 },
      { symbol: 'WETH',   name: 'Wrapped ETH',  address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', decimals: 18 },
      { symbol: 'WBTC',   name: 'Wrapped BTC',  address: '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011', decimals: 8 },
    ],
  },
  {
    id: 59144,
    name: 'Linea',
    shortName: 'LINEA',
    color: '#61DFFF',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0xA219439258ca9da29E9Cc4cE5596924745e12B93', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34', decimals: 18 },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b2', decimals: 8 },
    ],
  },
  {
    id: 534352,
    name: 'Scroll',
    shortName: 'SCROLL',
    color: '#EEB878',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x5300000000000000000000000000000000000004', decimals: 18 },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1', decimals: 8 },
    ],
  },
  {
    id: 34443,
    name: 'Mode',
    shortName: 'MODE',
    color: '#DFFE00',
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',     address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xd988097fb8612cc24eeC14542bC03424c656005f', decimals: 6 },
      { symbol: 'USDT',   name: 'Tether USD',   address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD', decimals: 6 },
      { symbol: 'WETH',   name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    ],
  },
  {
    id: 480,
    name: 'World Chain',
    shortName: 'WLD',
    color: '#1B1B1B',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    ],
  },
  {
    id: 130,
    name: 'Unichain',
    shortName: 'UNI',
    color: '#FC72FF',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x078D782b760474a361dDA0AF3839290b0EF57AD9', decimals: 6 },
      { symbol: 'USDT', name: 'Tether USD',   address: '0x9151434b16b9763660705744316aEf5B03A9A3C5', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    ],
  },
  {
    id: 57073,
    name: 'Ink',
    shortName: 'INK',
    color: '#7B3FE4',
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x9151434b16b9763660705744316aEf5B03A9A3C5', decimals: 6 },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18 },
    ],
  },
]

// Output tokens on Ethereum mainnet (vault inputs)
export const EARN_ETH_OUTPUT = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  symbol: 'WETH',
  decimals: 18,
}

export const EARN_USD_OUTPUT = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  symbol: 'USDC',
  decimals: 6,
}

// ERC-4626 vault contracts on Ethereum mainnet
export const VAULTS = {
  ETH: {
    address: '0xBBFC8683C8fE8cF73777feDE7ab9574935fea0A4',
    name: 'EarnETH',
    shareToken: 'earnETH',
    outputToken: EARN_ETH_OUTPUT,
    color: '#00a3ff',
    description: 'ETH growth vault allocating across leading blue-chip DeFi protocols',
    nativeAssets: ['ETH', 'WETH', 'stETH', 'wstETH'],
  },
  USD: {
    address: '0x4Ce1ac8F43E0E5BD7A346A98aF777bF8fbeA1981',
    name: 'EarnUSD',
    shareToken: 'earnUSD',
    outputToken: EARN_USD_OUTPUT,
    color: '#5ac878',
    description: 'USD yield strategies with transparent asset selection and risk controls',
    nativeAssets: ['USDC', 'USDT'],
  },
}
