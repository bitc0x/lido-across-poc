export interface TokenInfo {
  symbol: string
  name: string
  address: string
  decimals: number
  isNative?: boolean
  logoUrl: string
}

export interface ChainInfo {
  id: number
  name: string
  shortName: string
  color: string
  logoUrl: string
  tokens: TokenInfo[]
}

// Token logo constants (from Across /swap/tokens)
const LOGOS = {
  ETH:    'https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png?raw=true',
  USDC:   'https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png?raw=true',
  USDT:   'https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png?raw=true',
  WBTC:   'https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png?raw=true',
  DAI:    'https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png?raw=true',
  wstETH: 'https://github.com/trustwallet/assets/blob/master/blockchains/ethereum/assets/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0/logo.png?raw=true',
}

// Chain logo base URL (from Across /api/chains)
const CHAIN_BASE = 'https://alexandria-blond.vercel.app/assets/chains'

export const SUPPORTED_CHAINS: ChainInfo[] = [
  {
    // Ethereum is the vault destination chain — deposits here go directly to vault queues (no bridge)
    id: 1, name: 'Ethereum', shortName: 'ETH', color: '#627EEA',
    logoUrl: `${CHAIN_BASE}/mainnet.svg`,
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',     address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH',   name: 'Wrapped ETH',  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'wstETH', name: 'Wrapped stETH',address: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0', decimals: 18, logoUrl: LOGOS.wstETH },
      { symbol: 'USDC',   name: 'USD Coin',      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT',   name: 'Tether',        address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6,  logoUrl: LOGOS.USDT },
    ],
  },
  {
    id: 42161, name: 'Arbitrum', shortName: 'ARB', color: '#12AAFF',
    logoUrl: `${CHAIN_BASE}/arbitrum.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f', decimals: 8,  logoUrl: LOGOS.WBTC },
      { symbol: 'DAI',  name: 'Dai',          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, logoUrl: LOGOS.DAI },
    ],
  },
  {
    id: 8453, name: 'Base', shortName: 'BASE', color: '#0052FF',
    logoUrl: `${CHAIN_BASE}/base.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0xfde4C96c8593536E31F229EA8f37b2ADa2699bb2', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'DAI',  name: 'Dai',          address: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', decimals: 18, logoUrl: LOGOS.DAI },
    ],
  },
  {
    id: 10, name: 'Optimism', shortName: 'OP', color: '#FF0420',
    logoUrl: `${CHAIN_BASE}/optimism.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x68f180fcCe6836688e9084f035309E29Bf0A2095', decimals: 8,  logoUrl: LOGOS.WBTC },
      { symbol: 'DAI',  name: 'Dai',          address: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1', decimals: 18, logoUrl: LOGOS.DAI },
    ],
  },
  {
    id: 137, name: 'Polygon', shortName: 'POL', color: '#8247E5',
    logoUrl: `${CHAIN_BASE}/polygon.svg`,
    tokens: [
      { symbol: 'USDC', name: 'USD Coin',     address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', decimals: 8,  logoUrl: LOGOS.WBTC },
      { symbol: 'DAI',  name: 'Dai',          address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', decimals: 18, logoUrl: LOGOS.DAI },
    ],
  },
  {
    id: 324, name: 'zkSync Era', shortName: 'ZK', color: '#8C8DFC',
    logoUrl: `${CHAIN_BASE}/zk-sync.svg`,
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',     address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT',   name: 'Tether',       address: '0x493257fD37EDB34451f62EDf8D2a0C418852bA4C', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH',   name: 'Wrapped ETH',  address: '0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC',   name: 'Wrapped BTC',  address: '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011', decimals: 8,  logoUrl: LOGOS.WBTC },
    ],
  },
  {
    id: 59144, name: 'Linea', shortName: 'LINEA', color: '#61DFFF',
    logoUrl: `${CHAIN_BASE}/linea.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x176211869cA2b568f2A7D4EE941E073a821EE1ff', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0xA219439258ca9da29E9Cc4cE5596924745e12B93', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0xe5D7C2a44FfDDf6b295A15c148167daaAf5Cf34', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x3aAB2285ddcDdaD8edf438C1bAB47e1a9D05a9b2', decimals: 8,  logoUrl: LOGOS.WBTC },
    ],
  },
  {
    id: 534352, name: 'Scroll', shortName: 'SCR', color: '#EEB878',
    logoUrl: `${CHAIN_BASE}/scroll.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0xf55BEC9cafDbE8730f096Aa55dad6D22d44099Df', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x5300000000000000000000000000000000000004', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0x3C1BCa5a656e69edCD0D4E36BEbb3FcDAcA60Cf1', decimals: 8,  logoUrl: LOGOS.WBTC },
    ],
  },
  {
    id: 34443, name: 'Mode', shortName: 'MODE', color: '#DFFE00',
    logoUrl: `${CHAIN_BASE}/mode.svg`,
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',     address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xd988097fb8612cc24eeC14542bC03424c656005f', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT',   name: 'Tether',       address: '0xf0F161fDA2712DB8b566946122a5af183995e2eD', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH',   name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 480, name: 'World Chain', shortName: 'WLD', color: '#3D3D3D',
    logoUrl: `${CHAIN_BASE}/world-chain.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x79A02482A880bCE3F13e09Da970dC34db4CD24d1', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 130, name: 'Unichain', shortName: 'UNI', color: '#FC72FF',
    logoUrl: `${CHAIN_BASE}/unichain.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x078D782b760474a361dDA0AF3839290b0EF57AD9', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',       address: '0x9151434b16b9763660705744316aEf5B03A9A3C5', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 57073, name: 'Ink', shortName: 'INK', color: '#7B3FE4',
    logoUrl: `${CHAIN_BASE}/ink.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',     address: '0x9151434b16b9763660705744316aEf5B03A9A3C5', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 56, name: 'BNB Chain', shortName: 'BNB', color: '#F0B90B',
    logoUrl: `${CHAIN_BASE}/bsc.svg`,
    tokens: [
      { symbol: 'USDC', name: 'USD Coin', address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', decimals: 18, logoUrl: LOGOS.USDC },
      { symbol: 'USDT', name: 'Tether',   address: '0x55d398326f99059fF775485246999027B3197955', decimals: 18, logoUrl: LOGOS.USDT },
      { symbol: 'WETH', name: 'Wrapped ETH', address: '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 81457, name: 'Blast', shortName: 'BLAST', color: '#FCFC03',
    logoUrl: `${CHAIN_BASE}/blast.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH', name: 'Wrapped ETH',  address: '0x4300000000000000000000000000000000000004', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC', name: 'Wrapped BTC',  address: '0xF7bc58b8D8f97ADC129cfC4c9f45Ce3C0E1D2692', decimals: 8,  logoUrl: LOGOS.WBTC },
    ],
  },
  {
    id: 1135, name: 'Lisk', shortName: 'LISK', color: '#4070F4',
    logoUrl: `${CHAIN_BASE}/lisk.svg`,
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',    address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH',   name: 'Wrapped ETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xF242275d3a6527d877f2c927a82D9b057609cc71', decimals: 6, logoUrl: LOGOS.USDC },
      { symbol: 'USDT',   name: 'Tether',       address: '0x05D032ac25d322df992303dCa074EE7392C117b9', decimals: 6, logoUrl: LOGOS.USDT },
    ],
  },
  {
    id: 7777777, name: 'Zora', shortName: 'ZORA', color: '#AB6EFA',
    logoUrl: `${CHAIN_BASE}/zora.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',   address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH', name: 'Wrapped ETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 1868, name: 'Soneium', shortName: 'SON', color: '#00A8FF',
    logoUrl: `${CHAIN_BASE}/soneium.svg`,
    tokens: [
      { symbol: 'ETH',    name: 'Ethereum',     address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH',   name: 'Wrapped ETH',  address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0xbA9986D2381edf1DA03B0B9c1f8b00dc4AacC369', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT',   name: 'Tether',       address: '0x3A337a6adA9d885b6Ad95ec48F9b75f197b5AE35', decimals: 6,  logoUrl: LOGOS.USDT },
    ],
  },
  {
    id: 232, name: 'Lens', shortName: 'LENS', color: '#00501E',
    logoUrl: `${CHAIN_BASE}/lens.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',   address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH', name: 'Wrapped ETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'USDC', name: 'USD Coin',    address: '0x88F08E304EC4f90D644Cec3Fb69b8aD414acf884', decimals: 6,  logoUrl: LOGOS.USDC },
    ],
  },
  {
    id: 4326, name: 'MegaETH', shortName: 'MEGA', color: '#FF4500',
    logoUrl: `${CHAIN_BASE}/megaeth.svg`,
    tokens: [
      { symbol: 'ETH',  name: 'Ethereum',   address: '0x0000000000000000000000000000000000000000', decimals: 18, isNative: true, logoUrl: LOGOS.ETH },
      { symbol: 'WETH', name: 'Wrapped ETH', address: '0x4200000000000000000000000000000000000006', decimals: 18, logoUrl: LOGOS.ETH },
    ],
  },
  {
    id: 999, name: 'HyperEVM', shortName: 'HYPER', color: '#3EE8B5',
    logoUrl: `${CHAIN_BASE}/hyperevm.svg`,
    tokens: [
      { symbol: 'USDC',  name: 'USD Coin', address: '0xb88339CB7199b77E23DB6E890353E22632Ba630f', decimals: 6, logoUrl: LOGOS.USDC },
      { symbol: 'USDT0', name: 'Tether',   address: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb', decimals: 6, logoUrl: LOGOS.USDT },
    ],
  },
  {
    id: 143, name: 'Monad', shortName: 'MON', color: '#836EF9',
    logoUrl: `${CHAIN_BASE}/monad.svg`,
    tokens: [
      { symbol: 'USDC',  name: 'USD Coin', address: '0x754704Bc059F8C67012fEd69BC8A327a5aafb603', decimals: 6,  logoUrl: LOGOS.USDC },
      { symbol: 'USDT0', name: 'Tether',   address: '0xe7cd86e13AC4309349F30B3435a9d337750fC82D', decimals: 6,  logoUrl: LOGOS.USDT },
      { symbol: 'WETH',  name: 'Wrapped ETH', address: '0xEE8c0E9f1BFFb4Eb878d8f15f368A02a35481242', decimals: 18, logoUrl: LOGOS.ETH },
      { symbol: 'WBTC',  name: 'Wrapped BTC', address: '0x0555E30da8f98308EdB960aa94C0Db47230d2B9c', decimals: 8,  logoUrl: LOGOS.WBTC },
    ],
  },
  {
    id: 9745, name: 'Plasma', shortName: 'PLSM', color: '#7B2FBE',
    logoUrl: `${CHAIN_BASE}/plasma.svg`,
    tokens: [
      { symbol: 'USDT0', name: 'Tether', address: '0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb', decimals: 6, logoUrl: LOGOS.USDT },
    ],
  },
  {
    id: 4217, name: 'Tempo', shortName: 'TEMPO', color: '#FF6B35',
    logoUrl: `${CHAIN_BASE}/tempo.svg`,
    tokens: [
      { symbol: 'USDC.e', name: 'Bridged USDC', address: '0x20C000000000000000000000b9537d11c60E8b50', decimals: 6, logoUrl: LOGOS.USDC },
    ],
  },
]

// Output tokens on Ethereum mainnet
export const EARN_ETH_OUTPUT = {
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  symbol: 'WETH',
  decimals: 18,
}

export const EARN_USD_OUTPUT = {
  address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  symbol: 'USDC',
  decimals: 6,
}

// Vault contracts on Ethereum mainnet
export const VAULTS = {
  ETH: {
    address: '0xBBFC8683C8fE8cF73777feDE7ab9574935fea0A4',
    name: 'EarnETH',
    shareToken: 'earnETH',
    outputToken: EARN_ETH_OUTPUT,
    color: '#00a3ff',
    description: 'ETH growth vault allocating across leading blue-chip DeFi protocols',
  },
  USD: {
    address: '0x4Ce1ac8F43E0E5BD7A346A98aF777bF8fbeA1981',
    name: 'EarnUSD',
    shareToken: 'earnUSD',
    outputToken: EARN_USD_OUTPUT,
    color: '#5ac878',
    description: 'USD yield vault with transparent asset selection and risk controls',
  },
}
