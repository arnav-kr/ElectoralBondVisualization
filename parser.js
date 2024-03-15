const fs = require("fs");

raw = fs.readFileSync("./public/assets/parties.csv", "utf8");
let finalCSV = raw.split("\n").map((row, i) => {
  row = row.replaceAll("\f", "").replaceAll(/\s{2,}/gmi, "*").split("*")
  row.shift()
  row[1] = row[1].replaceAll(/,/g, "").replaceAll("\"", "")
  if (i == 0) return;
  return {
    name: row[0],
    amount: parseInt(row[1])
  };
}).filter(i => i).sort((a, b) => b.amount - a.amount);
let data = {};
finalCSV.forEach(row => {
  if (data[row.name]) {
    data[row.name] += row.amount;
  } else {
    data[row.name] = row.amount;
  }
});


let out = [["name", "amount"], ...Object.entries(data)].map(d => {
  d[0] = `"${d[0]}"`
  return d.join(",")
}).join("\n")
console.log(out)
fs.writeFileSync("./public/assets/parties.csv", out);