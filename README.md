# electron-httpdns

Sometimes we use the http-translating-domain-to-dns service provided by the cloud servicers(like [Amazon Route 53](https://aws.amazon.com/route53/?nc1=h_ls), [AlibabaCloud httpdns](https://www.alibabacloud.com/help/doc-detail/27139.html?spm=a2c5t.10695662.1996646101.searchclickresult.17f16a645Jpbr4),  [Tencent Cloud httpdns](https://cloud.tencent.com/product/hd)) for avoiding dns-hijacking & improving the network performance.
electron-httpdns is build as a middleware for the devlopers who wants to use the above domain-to-dns service in their electron applications.

Since i'm just working with **AlibabaCloud httpdns** right now, so it support only alibaba httpdns service currently.But **TecentCloud** provides a free httpdns service right now, so that'll be supported soon. **Amazon Route 53** will be the last one in the future. 

For

## How to Use
Install `electron-httpdns`
```
    npm i --save electron-httpdns
```
OR
```
    yarn add electron-httpdns
```


# dnsResolverManager
```ts
    import {dnsResolverManager} from 'electron-httpdns'
    //for example
    const config = {
        type: 'ali', // defines which service you use, only support "ali" currently.
        secret: 'your-ali-httpdns-secret', // only required when you'r using alibaba-cloud
        accountId: 'your-ali-httpdns-accountId', // only required when you'r using alibaba-cloud
        servers: ['servers-ip-address-that-alibaba-cloud provided'] // there's some default ip address,so this one could be skipped.BUT, if you use it, it would replace the default servers(not concat).
        httpExecutor: async (url) => {
            // an http request that can accept an url string.
            // for example, axios.get
            return await axios.get(url) // and should return data formatted like this {ips: []}
        }
    }
    const resovler = dnsResolverManager(confg)
    resolver.resolve('domains.you.want.to.resolve').then(ip=>{
        console.log(ip) // ‘111.111.111.111’yon
    })
```


# HttpDnsURL
Class HttpDnsURL is extended from URL. Add the **ip** attribute. And re-writes the **href getter** that use the **ip** to replace the **hostname**. And re-write **host** getter to return the origin-domain.

```ts
    import {HttpDnsURL} from 'electron-httpdns'
    const url = new HttpDnsURL('/path', 'http://something.com', {
        ip: '111.111.111.111'
    })
    console.log(url.href) // http://111.111.111.111/path
    console.log(url.host) // something.com
```