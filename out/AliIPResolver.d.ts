import BasicIPResolver, { IPArray, HttpDnsConfig } from './BasicIPResolver';
export interface AliHttpDNSResult {
    readonly ips: Array<string>;
    readonly host: string;
    readonly ttl: number;
    readonly origin_ttl: number;
}
export declare const aliServers: string[];
export interface AliDnsConfig extends HttpDnsConfig {
    secret: string;
    accountId: string;
    servers?: Array<string> | string;
    httpExecutor(url: string): Promise<AliHttpDNSResult>;
}
export default class AliIPResolver extends BasicIPResolver {
    constructor(config: AliDnsConfig);
    protected httpExecutor(url: string): Promise<AliHttpDNSResult>;
    protected secret: string;
    protected accountId: string;
    request(url: string): Promise<IPArray | null | undefined>;
    createRequestUrl(dnsServer: string | undefined, host: string): Promise<string>;
}
