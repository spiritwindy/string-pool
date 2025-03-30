import { StrPool } from './StrPool';
class Ref{
    start: number;
    end: number;
    pool: StrPool;
    /**
     * @param {StrPool} pool 
     * @param {number} end
     * @param {number} start
     */
    constructor(pool:StrPool, start:number, end:number)
    { 
        
        this.pool = pool;
        this.start = start;
        this.end = end;
    }
    static toNewRef(ref: Ref) {
        if (ref.pool.base) {
            new StrPool({ str: ref.pool.str?.slice(ref.start,ref.end), start: 0, end: ref.pool.length! - 1, type: 2 })
        }
    }
}
export { Ref };
