import { Ref } from "./ref";

export class StrPool {
    static wpool = new WeakMap();
    base = true
    ref: StrPool[] = [];//引用的

    link = <Ref[]|null>[]
    str: string | undefined;
    length: number | undefined;
    constructor({ str, type = 1, strPool, start, end, link }: {
        str?: string, type?: number, strPool?: StrPool, start?: number, end?: number,
        link?: Ref[]
    }) {
        if (type == 1 && link == null) {
            this.str = str;
            this.base = true;
            this.length = str?.length
            this.link = null;
            StrPool.wpool.set(this, this.str)
        } else if (type == 2&& start != undefined && end != undefined && strPool != undefined) {
            this.base = false
            this.link!.push(...StrPool.calu(strPool, start, end))
            this.length = end - start
        }
        else if (link) {
            this.base = false
            this.link = link;
            this.length = this.sumLen();
        }
    }
    slice(start: number, end: number) {
        if (this.base) {
            if (start < 0 || end > (this.length ?? 0) || start >= end) {
                throw new Error("Invalid start or end indices for slicing.");
            }
            let s = new StrPool({ strPool: this, start, end, type: 2 })
            this.ref.push(s)
            return s
        } else {
            let link = StrPool.calu(this, start, end)
            let p = new StrPool({ link, type: 3 })
            link.forEach((ref) => {
                ref.pool.ref.push(p)
            })
            return p;
        }
    }
    toString() {
        if (this.base) {
            return this.str
        } else {
            let str = ''
            for (let i = 0; i < this.link!.length; i++) {
                let ref = this.link![i]
                if (ref.pool) {
                    str += ref.pool.str?.slice(ref.start, ref.end)??""
                }
            }
            return str
        }
    }
    del() {
        StrPool.wpool.delete(this);
        this.ref.forEach((ref) => {
            ref.link?.forEach((v,index)=>{
                if (v.pool == this) {
                    ref.link![index] = Ref.toNewRef(v)!
                }
            })
        })
    }
    static calu(strPool: StrPool, start: number, end: number) {
        if (strPool.base) {
            return [new Ref(strPool, start, end)]
        } else {
            let link = strPool.link!
            let refs: Ref[] = []
            for (let i = 0; i < link.length; i++) {
                let ref = link[i]
                let arr = [ref.start + start, Math.min(ref.end, ref.start + end)]
                if (arr[0] < arr[1]) {
                    refs.push(new Ref(ref.pool, arr[0], arr[1]))
                    end -= start + arr[1] - arr[0]
                    start = 0
                } else { 
                    start -= ref.end - ref.start
                    end -= ref.end - ref.start
                }
                if (end <= 0) break
            }
            return refs
        }
    }

    static join(...pools: StrPool[]) {
        const link: Ref[] = []
        for (let index = 0; index < pools.length; index++) {
            const pool = pools[index];
            if (pool.base) {
                link.push(new Ref(pool, 0, pool.length!))
            } else if(pool.link?.length){
                link.push(...pool.link)
            }
        }
        return new StrPool({ link,type: 3 })
    }
    sumLen() {
        if(this.link == null) return this.str?.length
        return this.link.reduce((pre, cur) => {
            return pre + cur.end - cur.start
        }, 0)
    }
}