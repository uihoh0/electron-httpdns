
import { configureRequestUrl } from "builder-util-runtime"
import { ElectronHttpExecutor } from 'electron-updater/out/ElectronHttpExecutor'
import { URL } from 'url'
import md5 from 'md5'

import BasicIPResolver, { IPArray, HttpDnsConfig } from './BasicIPResolver'

export interface AliHttpDNSResult {
    readonly ips: Array<string>
    readonly host: string,
    readonly ttl: number,
    readonly origin_ttl: number
}

export const aliServers = [
    '203.107.1.1',
    '203.107.1.33',
    '203.107.1.34',
    '203.107.1.35'
]

export interface AliDnsConfig extends HttpDnsConfig {
    secret: string,
    accountId: string,
    servers?: Array<string> | string
}

export default class AliIPResolver extends BasicIPResolver {
    constructor(config: AliDnsConfig) {
        super(config.servers || aliServers)
        this.secret = config.secret
        this.accountId = config.accountId
    }
    protected secret:string
    protected accountId: string
    public async request(url: string): Promise<IPArray | null | undefined> {
        const httpExecutor = new ElectronHttpExecutor((authInfo: any, callback: Function) => callback)
        const opts = {}
        configureRequestUrl(new URL(url), opts);
        let resultStr;
        resultStr = await httpExecutor.request(opts)
        const result: AliHttpDNSResult = resultStr ? JSON.parse(resultStr) : {}
        return result.ips;
    }
    public async createRequestUrl(dnsServer: string | undefined, host: string): Promise<string> {
        if (!dnsServer) {
            return '';
        }
        const now = (new Date());
        let timestamp = now.setMinutes(now.getMinutes() + 4)
        timestamp = Math.round(timestamp / 1000);
        return `http://${dnsServer}/${this.accountId}/sign_d?host=${host}&t=${timestamp}&s=${md5(`${host}-${this.secret}-${timestamp}`)}`
    }
}