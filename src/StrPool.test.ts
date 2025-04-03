import { StrPool } from "./StrPool";

// StrPool
let pool = new StrPool({ str: '123456789' });
let pool2 = new StrPool({ str: 'abcdefghi' });
let pool3 = new StrPool({ str: '--------###-------------' });
let s = pool.slice(0, 4)!
let s2 = pool2.slice(0, 4)!
let s3= pool3.slice(0, 4)!

// console.log(s)
let d = StrPool.join(pool, pool2, pool3)
console.log(d)
console.log(d.toString())

// console.log(s)
let d1 = StrPool.join(s, s2, s3)
console.log(d1)
console.log(d1.toString())
let s0 = "123456789abcdef".repeat(0.5e7);
let bigpool = new StrPool({ str: s0 })
let s12 = bigpool.slice(10000, 10009);
let s23 = bigpool.slice(10010, 10014);
console.log(s12.toString())
console.log(s23.toString())

let s33 = StrPool.join(s12, s23);
// bigpool.del()
// process.stdin.read();
// console.log(process.memoryUsage());
console.log(s33.toString())
// bigpool.del();
bigpool = undefined!;
// console.log(process.memoryUsage());
console.log("s33",s33.toString())
console.log("s33.slice(3, 11).toString()",s33.slice(3, 11).toString())
console.log (s33.slice(11,13).toString())
