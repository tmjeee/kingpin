
import Q, {PromiseState, Deferred} from "q";

Q.spread([1,2],
  (a:number, b:number)=>{});

Q.allSettled([])
  .then((r:PromiseState<any>[])=>{

  });

let deferred:Deferred<any> = Q.defer();
let p:any = Q.Promise((resolve, reject, notify)=>{
  reject('xxx');
  resolve('xxx');
} );

Q.defer();

Q.delay(10)
  .then(()=>{

  });

Q.when()
  .get("ss")
  .set("foo", "")
