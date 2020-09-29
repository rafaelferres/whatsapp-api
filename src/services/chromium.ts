import puppeteer from "puppeteer-core";


class Chromium {
    
    public static async downloadChromium(){
        return new Promise(async (resolve, reject) => {
            const browserFetcher = puppeteer.createBrowserFetcher({
                path: process.cwd()
            });

            var response : any = {};

            response.revNumber = await this.getRev();
            response.revisionInfo = await browserFetcher.download(response.revNumber, (download, total) => {
                var percentage = (download * 100) / total;
                //console.log(percentage);
            });

            resolve(response);
        });
    }

    public static async getRev(): Promise<string>{
        return new Promise(async (resolve, reject) => {
            resolve("666595");
        });
    }
}

export { Chromium };