/**
 * Place crossword answers so they actually cross, then crop the grid.
 */
function cloneGrid(grid) {
  return grid.map((row) => [...row]);
}

function canPlace(grid, word, r, c, dir) {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;
  const rows = grid.length;
  const cols = grid[0].length;
  for (let i = 0; i < word.length; i++) {
    const rr = r + dr * i;
    const cc = c + dc * i;
    if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) return false;
    const existing = grid[rr][cc];
    if (existing && existing !== word[i]) return false;
  }
  return true;
}

function doPlace(grid, word, r, c, dir) {
  const dr = dir === "down" ? 1 : 0;
  const dc = dir === "across" ? 1 : 0;
  for (let i = 0; i < word.length; i++) {
    grid[r + dr * i][c + dc * i] = word[i];
  }
}

function candidateStarts(word, dir, placed, size, grid) {
  const starts = [];
  if (placed.length === 0) {
    starts.push([4, 4], [6, 2], [2, 6], [8, 4]);
    return starts;
  }
  for (const p of placed) {
    if (p.direction === dir) continue;
    for (let ai = 0; ai < word.length; ai++) {
      for (let bi = 0; bi < p.answer.length; bi++) {
        if (word[ai] !== p.answer[bi]) continue;
        if (dir === "across") {
          const r = p.direction === "down" ? p.row + bi : p.row;
          const c = (p.direction === "across" ? p.col + bi : p.col) - ai;
          starts.push([r, c]);
        } else {
          const r = (p.direction === "down" ? p.row + bi : p.row) - ai;
          const c = p.direction === "across" ? p.col + bi : p.col;
          starts.push([r, c]);
        }
      }
    }
  }
  if (starts.length === 0) {
    let maxR = 0;
    for (const p of placed) {
      maxR = Math.max(maxR, p.direction === "down" ? p.row + p.answer.length : p.row);
    }
    starts.push([maxR + 2, 2]);
  }
  return starts;
}

function solve(entries, size = 24) {
  const orders = [];
  const n = entries.length;
  if (n <= 7) {
    const permute = (arr) => {
      if (arr.length <= 1) return [arr];
      const out = [];
      arr.forEach((item, i) => {
        for (const rest of permute(arr.filter((_, j) => j !== i))) out.push([item, ...rest]);
      });
      return out;
    };
    orders.push(...permute(entries));
  } else {
    orders.push(entries, [...entries].sort((a, b) => b.answer.length - a.answer.length));
  }
  let result = null;

  function dfs(list, i, grid, placed) {
    if (result) return true;
    if (i === list.length) {
      result = { grid, placed };
      return true;
    }
    const entry = list[i];
    const word = entry.answer;
    const seen = new Set();
    for (const [r, c] of candidateStarts(word, entry.direction, placed, size, grid)) {
      const key = `${r},${c}`;
      if (seen.has(key)) continue;
      seen.add(key);
      if (!canPlace(grid, word, r, c, entry.direction)) continue;
      const nextGrid = cloneGrid(grid);
      doPlace(nextGrid, word, r, c, entry.direction);
      if (dfs(list, i + 1, nextGrid, [...placed, { ...entry, row: r, col: c }])) return true;
    }
    return false;
  }

  const empty = Array.from({ length: size }, () => Array(size).fill(""));
  for (const order of orders) {
    if (dfs(order, 0, cloneGrid(empty), [])) break;
  }
  if (!result) return null;

  const placed = result.placed;
  let minR = size;
  let minC = size;
  let maxR = 0;
  let maxC = 0;
  for (const p of placed) {
    const lastR = p.direction === "down" ? p.row + p.answer.length - 1 : p.row;
    const lastC = p.direction === "across" ? p.col + p.answer.length - 1 : p.col;
    minR = Math.min(minR, p.row);
    minC = Math.min(minC, p.col);
    maxR = Math.max(maxR, lastR);
    maxC = Math.max(maxC, lastC);
  }
  return placed.map((p) => ({
    ...p,
    row: p.row - minR,
    col: p.col - minC,
    rows: maxR - minR + 1,
    cols: maxC - minC + 1,
  }));
}

function A(number, clue, answer) {
  return { number, clue, answer: answer.replace(/[^A-Za-z]/g, "").toUpperCase(), direction: "across" };
}
function D(number, clue, answer) {
  return { number, clue, answer: answer.replace(/[^A-Za-z]/g, "").toUpperCase(), direction: "down" };
}

const puzzles = {
  foundations1: {
    wordBank: ["Profit", "Wages", "Budget", "Invoice", "Bribe", "Pocket Money", "Savings", "Track"],
    entries: [
      A(3, "The small amount of cash parents/guardians sometimes give their kids for snacks or personal use.", "POCKETMONEY"),
      A(4, "A financial plan where you decide how much to spend and save weekly or monthly.", "BUDGET"),
      D(1, "The money you put aside in a piggy bank, glass jar or M-Shwari account, for future use.", "SAVINGS"),
      D(2, "Money paid daily or weekly for someone’s casual labour or work.", "WAGES"),
      D(3, "What you make when you sell something for more than the price you paid for it.", "PROFIT"),
    ],
  },
  foundations2: {
    wordBank: ["Payoff", "Backpay", "Expense", "Loss", "Ledger", "Wealth", "Allowance"],
    entries: [
      A(3, "The total value of everything you own, including cash and property.", "WEALTH"),
      A(4, "The result of spending more money on a business than you actually make.", "LOSS"),
      A(5, "Money owed to you for work done in the past that wasn't paid on time.", "BACKPAY"),
      D(1, "Anything you spend money on, like airtime, bus fare, or snacks.", "EXPENSE"),
      D(2, "A set amount of money given to you regularly, like a monthly stipend by a parent/guardian.", "ALLOWANCE"),
    ],
  },
  foundations3: {
    wordBank: ["Accounts", "Track", "Balance", "Coins", "Books", "Priority", "Record", "Security"],
    entries: [
      A(1, "The feeling of safety you have when your money is protected and steady.", "SECURITY"),
      A(3, "The amount of money remaining in your account or wallet right now.", "BALANCE"),
      A(5, "Choosing to buy what you need like school supplies before what you want, like a packet of crisps.", "PRIORITY"),
      D(2, "To follow and record every shilling you spend so you don't go broke.", "TRACK"),
      D(4, "Metallic currency, like the 1, 5, 10, or 20 shilling pieces.", "COINS"),
    ],
  },
  foundations4: {
    wordBank: ["Receipt", "Income", "Notes", "Salary", "Cash", "Price", "Pay", "Plan"],
    entries: [
      A(1, "The money you earn from working a job or from your business activities.", "INCOME"),
      A(4, "Fixed monthly pay, usually for an individual’s professional work.", "SALARY"),
      A(5, "Physical money in the form of notes and coins.", "CASH"),
      D(2, "Paper money; in Kenya, these range from 50 to 1,000 shillings.", "NOTES"),
      D(3, "The amount you verify before buying something like a smokie pasua, a soda or boarding a matatu.", "PRICE"),
    ],
  },
  income1: {
    wordBank: ["Pay", "Wage", "Tip", "Commission", "Salary", "Bonus", "Allowance", "Cash"],
    entries: [
      A(2, "A fixed regular payment typically paid on a monthly basis by an employer.", "SALARY"),
      A(5, "Payment based on the number of hours an employee works or days completed, common for manual jobs.", "WAGE"),
      D(2, "A set amount of money given by a parent/guardian to their child for specific needs, like school fare, airtime or lunch.", "ALLOWANCE"),
      D(3, "That extra money an employee gets at the end of the year for hitting a big sales target.", "BONUS"),
      D(4, "Some additional money left for a helpful waiter at a local Java, or a nail tech for excellent service.", "TIP"),
    ],
  },
  income2: {
    wordBank: ["Dividend", "Cheque", "Gift", "Commission", "Rent", "Interest"],
    entries: [
      A(3, "Money earned by a salesperson for every item sold; for example, an Mpesa agent's profit.", "COMMISSION"),
      A(5, "A share of the profits paid out to people who own stock in companies like Safaricom or KCB.", "DIVIDEND"),
      D(1, "The money you receive if you own a building and let other people use it either as a house or a shop.", "RENT"),
      D(2, "Money given to you for a special occasion e.g. on your birthday.", "GIFT"),
      D(4, "The growth money you earn just for keeping your savings in a bank account or a Sacco for a given period of time.", "INTEREST"),
    ],
  },
  income3: {
    wordBank: ["Salary", "Prize", "Grants", "Charity", "Hustle", "Business", "Pocket Money", "Freelance"],
    entries: [
      A(3, "Working on different projects for various clients, such as doing graphic design or academic writing online.", "FREELANCE"),
      A(4, "Income earned from selling goods or services, like running a small kiosk or an online shop.", "BUSINESS"),
      A(5, "A sum of money given by an organization or government to a specific person, for a particular purpose, which does not need to be repaid.", "GRANTS"),
      D(1, "Small amounts given by parents for personal spending on things like snacks or data.", "POCKETMONEY"),
      D(2, "What you win for coming first in a competition that sometimes involves money.", "PRIZE"),
    ],
  },
  income4: {
    wordBank: ["Revenue", "Side Hustle", "Cashback", "Royalties", "Tax", "Bank", "Pension", "Social Security"],
    entries: [
      A(4, "A government safety net that provides financial support to those in need or the elderly.", "SOCIALSECURITY"),
      A(5, "A secondary job you do after work to earn extra cash, like selling thrifted clothes on Instagram.", "SIDEHUSTLE"),
      D(1, "Payments made to creators for the ongoing use of their intellectual property.", "ROYALTIES"),
      D(2, "A small percentage of money returned to your wallet after paying for shopping via apps like Loop at partner outlets.", "CASHBACK"),
      D(3, "Regular payments received by retirees after they stop working, often from the NSSF.", "PENSION"),
    ],
  },
  trade1: {
    wordBank: ["Barter", "Shilling", "CBK", "Services", "Goods", "Pesa", "Rupee", "Cent", "Cowrie Shells", "Trade"],
    entries: [
      A(3, "Intangible actions, efforts, or performances provided by one person to another, often in exchange for payment, e.g. braiding hair.", "SERVICES"),
      A(7, "Small, durable sea shells from the Indian Ocean used as a pre-colonial form of money.", "COWRIESHELLS"),
      D(1, "Physical items, like beads or cloth, that were exchanged in the early trade economies of Kenya before modern money was introduced.", "GOODS"),
      D(2, "The smaller unit that makes up one Shilling; 100 of these equal one shilling.", "CENT"),
      D(4, "The currency brought by Indian labourers during the construction of the Kenya - Uganda railway in the late 1800s.", "RUPEE"),
      D(5, "The general process of exchanging items between different communities, which helped create early social and economic bonds across the region.", "TRADE"),
      D(6, "The common Swahili word for money, believed to have originated from the Indian Pice or Portuguese Peso.", "PESA"),
      D(7, "The abbreviation for the Central Bank of Kenya, the institution that manages and issues all Kenyan currency.", "CBK"),
    ],
  },
  budgeting1: {
    wordBank: ["Monetary", "Food", "Goal setting", "Fare", "Value", "Prioritize", "Rent", "Trade"],
    entries: [
      A(2, "The money you pay to the makanga to travel in a matatu.", "FARE"),
      A(3, "The payment made to a landlord in exchange for a place to live.", "RENT"),
      A(5, "Putting your most important expenses, like fare to school, at the top of your list.", "PRIORITIZE"),
      D(1, "Defining exactly what you want to buy in the future, like a new laptop or bike.", "GOALSETTING"),
      D(4, "An essential daily expense for meals, snacks, or that midday cup of tea.", "FOOD"),
    ],
  },
  currency3: {
    wordBank: ["Ten", "Signature", "Cotton Paper", "Shilling", "Twenty", "KES", "Visa", "Cash", "Notes", "Mpesa"],
    entries: [
      A(5, "The physical material the Kenyan paper money is printed on.", "COTTONPAPER"),
      A(7, "The legal mark of the Central Bank Governor found on all Kenya shilling notes.", "SIGNATURE"),
      A(8, "A common brand mark found on bank debit cards used to tap and pay at the supermarket.", "VISA"),
      D(1, "The official name of Kenya's currency unit. It starts with S.", "SHILLING"),
      D(2, "The world-famous mobile money service launched by Safaricom in 2007.", "MPESA"),
      D(3, "Physical paper money, including the brown 1,000 bob and the red 50 bob.", "NOTES"),
      D(4, "The three-letter international code used to represent Kenyan money.", "KES"),
      D(6, "Physical money i.e. coins and notes as opposed to digital transfers.", "CASH"),
    ],
  },
  currency4: {
    wordBank: ["Notes", "Purple", "Wallet", "Pesalink", "Blue Green", "Coins", "Fifty", "Bank", "Airtel"],
    entries: [
      A(2, "The color of the security thread on the 100 bob note when viewed at an angle.", "PURPLE"),
      A(4, "The color shift effect specific to the security thread of the 200 banknote.", "BLUEGREEN"),
      A(6, "Not just for leather anymore; now it’s also in digital form found in phones.", "WALLET"),
      A(7, "Metal money used for small change, like the 1, 5, 10, or 20 denominations.", "COINS"),
      D(1, "The main competitor to Mpesa for mobile transactions.", "AIRTEL"),
      D(3, "The service used to send money instantly from one bank account to another.", "PESALINK"),
      D(5, "The unique color effect of the Ksh. 50 note's security thread when tilted at an angle.", "FIFTY"),
    ],
  },
};

for (const [key, puzzle] of Object.entries(puzzles)) {
  const placed = solve(puzzle.entries);
  if (!placed) {
    console.error("FAILED", key);
    continue;
  }
  const rows = placed[0].rows;
  const cols = placed[0].cols;
  console.log("\n===", key, rows, "x", cols, "===");
  for (const p of placed.sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction))) {
    console.log(`${p.direction[0].toUpperCase()} ${p.number} ${p.answer} r${p.row} c${p.col}`);
  }
}
