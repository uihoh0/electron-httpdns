import { readFile } from "fs-extra-p"
import { safeLoad } from 'js-yaml'
import path from 'path'
import electron from 'electron'

import BasicIPResolver from './BasicIPResolver'
import AliIPResolver from './AliIPResolver'


interface YmlConf {
  httpdns: any
}

const app = electron.app || electron.remote.app;
export function getUpdateInfoPath() {
  return app.isPackaged ? path.join(process.resourcesPath!!, "app-update.yml") : path.join(app.getAppPath(), 'dev-app-update.yml')
}
let httpdnsConfig : any 
let resolver: BasicIPResolver | false = false
export async function getUpdateInfo ():Promise<any> {
  if(httpdnsConfig !== undefined){
    return httpdnsConfig
  }
  const configPath = getUpdateInfoPath()
  const config: YmlConf = safeLoad(await readFile(configPath, "utf-8"))
  httpdnsConfig = config.httpdns ? config.httpdns : null
  return httpdnsConfig
}
export default async function dnsResolverManager(): Promise<BasicIPResolver | false> {
  if(resolver){
    return resolver
  }
  const httpdns = await getUpdateInfo()
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