

import BasicIPResolver from './BasicIPResolver'
import AliIPResolver from './AliIPResolver'

let resolver: BasicIPResolver | false = false

export default async function dnsResolverManager(httpdns?: any): Promise<BasicIPResolver | false> {
  if(resolver){
    return resolver
  }
  if (!httpdns) {
    return false
  }
  switch(httpdns.type){
    case 'ali': 
      resolver =  new AliIPResolver(httpdns)
      break;
    default: 
      break;
  }
  return resolver
}