import { StrPool } from './StrPool';
class Ref {
    start: number;
    end: number;
    pool: StrPool;
    /**
     * @param {StrPool} pool 
     * @param {number} end
     * @param {number} start
     */
    constructor(pool: StrPool, start: number, end: number) {

        this.pool = pool;
        this.start = start;
        this.end = end;
    }
    static toNewRef(ref: Ref) {
        if (ref.pool.base) {
            return new Ref(new StrPool({
                str: ref.pool.str?.slice(ref.start, ref.end),
                start: 0,
                end: ref.end - ref.start, type: 1
            }), 0, ref.end - ref.start )
        }
    }
}
export { Ref };
