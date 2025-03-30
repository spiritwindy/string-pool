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
        if (type == 1) {
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
        else if (link && type == 3) {
            this.base = false
            this.link = link;
            this.length = this.sumLen();
        }
    }
    slice(start: number, end: number) {
        if (this.base) {
            let s = new StrPool({ strPool: this, start, end, type: 2 })
            this.ref.push(s)
            return s
        } else {
            let link = StrPool.calu(this, start, end)
            return new StrPool({ link })
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
            // ref.del()
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
                let arr = [ref.start + start, ref.start + end]
                if (arr[1] <= ref.end) {
                    refs.push(new Ref(ref.pool, arr[0], arr[1]))
                } else {
                    end = ref.end;
                    refs.push(new Ref(ref.pool, start, end))
                    end -= ref.end - ref.start
                    start = 0
                    if (end <= 0) break
                }
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