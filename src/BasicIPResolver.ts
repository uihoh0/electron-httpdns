
export interface IPArray extends Array<string> { }


export interface HttpDnsConfig {
    type: string
}
export default abstract class BasicIPResolver {
    constructor(servers?: Array<string> | string) {
        this.ipsCache = {}
        if (!servers) {
            return
        }
        if (Array.isArray(servers)) {
            this.servers = this.servers.concat(servers)
            return
        }
        this.servers.push(servers)
    }
    private servers: Array<string> = []
    public ipsCache: { [index: string]: Array<string> }
    abstract async request(url: string): Promise<IPArray | null | undefined>
    public async resolve(host: string, servers?: Array<string>): Promise<string | false | null> {
        const cache = this.ipsCache[host];
        if (cache) {
            return cache[0]
        }
        const ips = await this.loopResolve(host, servers || this.servers);
        if (!ips || ips.length < 1) {
            return false
        }
        this.ipsCache[host] = ips;
        return ips[0]
    }
    public async createRequestUrl(dnsServer: string | undefined, host: string): Promise<string> {
        return `http://${dnsServer}/?${host}`
    }
    protected async loopResolve(host: string, servers?: IPArray): Promise<IPArray | null | undefined> {
        const _servers: Array<string> = (servers || []).slice(0);
        if (_servers.length < 1) {
            return null
        }
        _servers.sort(() => Math.random() > 0.5 ? -1 : 1);
        const dnsServer = _servers.pop();
        let url = await this.createRequestUrl(dnsServer, host);
        if (!url) {
            return null;
        }
        try {
            return await this.request(url)
        } catch (e) {
            // console.log('error:', e)
            return await this.loopResolve(host, _servers)
        }
    }
}