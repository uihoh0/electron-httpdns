
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
    servers?: Array<string> | string,
    httpExecutor: any
}

export default class AliIPResolver extends BasicIPResolver {
    constructor(config: AliDnsConfig) {
        super(config.servers || aliServers)
        this.secret = config.secret
        this.accountId = config.accountId
        this.httpExecutor = config.httpExecutor
    }
    protected httpExecutor: any
    protected secret:string
    protected accountId: string
    public async request(url: string): Promise<IPArray | null | undefined> {
        const result: AliHttpDNSResult  = await this.httpExecutor(url)
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