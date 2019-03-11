import {URL} from 'url'
interface HttpDnsURLOpt  {
    ip: string
}
export default class HttpDnsURL extends URL {
    private _ip?: string
    private _originHostName?: string
    constructor(input: string, base?: string | URL | undefined, options?: HttpDnsURLOpt){
        super(input, base)
        const tmp = new URL(input, base)
        this._originHostName = tmp.hostname
        this._ip = options && options.ip
    }
    get href() {
        const url = this
        let href = `${url.protocol}//${url.ip || url.hostname}`
        if (url.port) {
            href += `:${url.port}`
        }
        href += `${url.pathname}${url.search}`
        return href
    }
    get hostname(){
        return this._ip || this._originHostName || this.host
    }
    set host(str:string){
        this._originHostName = str
        this.host = str
    }
    get host () {
      return this._originHostName || this.host || this.hostname
    }
    get ip(): string|undefined{
        return this._ip
    }
    set ip(ip:string | undefined){
        this._ip = ip
    }
}