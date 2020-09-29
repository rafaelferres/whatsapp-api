import puppeteer from "puppeteer-core";
import path from "path";
import { readdirSync, readFile } from "fs";
import rimraf from "rimraf";

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

    public static async checkChromiumVersions(folderPath: string): Promise<any>{
        var basename = path.basename(folderPath);

        var getDirectories = source =>
            readdirSync(source, { withFileTypes: true })
                .filter(dirent => dirent.isDirectory())
                .map(dirent => dirent.name);
        var current_folders = await getDirectories('./');

        var map_folders = current_folders.map(async (folder) => {
            if (folder.includes(basename.split('-')[0])) {
                if (folder != basename) {
                    await rimraf.sync(folder);
                }
            }
        });

        await Promise.all(map_folders);
    }
}

export { Chromium };