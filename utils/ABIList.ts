const erc20ABI = ["function decimals() view returns (uint8)"];
const factoryABI = ["function getPair(address tokenA, address tokenB) external view returns (address pair)"]; //getPairs
const pairABI = [
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function getReserves() public view returns (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)"
];
const routerABI = ["function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)"];

export {erc20ABI, factoryABI, pairABI, routerABI};