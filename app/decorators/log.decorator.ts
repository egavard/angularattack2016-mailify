/**
 * Created by egavard on 14/05/16.
 */
export function log(){
    return function (target:any, key:string, descriptor:PropertyDescriptor) {
        if (descriptor) {
            return {
                value: function (...args:any[]) {
                    var a = args.map(a => JSON.stringify(a)).join();
                    var result = descriptor.value.apply(this, args);
                        console.log(`${key}(${a})`);
                    return result;
                }
            };
        }
    }
}