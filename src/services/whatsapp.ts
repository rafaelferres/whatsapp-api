import * as constants from "../constants";
import puppeteer from "puppeteer-core";
import path from "path";
import qrcode from "qrcode-terminal";

import utils from "./utils";
import { logger } from "./logger";

class Whatsapp {
    public isLogin: boolean = false;

    public async launch(executablePath: string): Promise<puppeteer.Browser>{
        return new Promise(async (resolve, reject) => {
            const extraArguments = Object.assign({});

            var pptrArgv = [];

            extraArguments.userDataDir = constants.DEFAULT_DATA_DIR;

            var browser = await puppeteer.launch({
                executablePath: executablePath,
                headless: true,
                userDataDir: path.join(process.cwd(), "ChromeSession"),
                devtools: false,
                args: [...constants.DEFAULT_CHROMIUM_ARGS, ...pptrArgv], ...extraArguments
            });

            resolve(browser);
        });
    }

    public async open(browser: puppeteer.Browser): Promise<puppeteer.Page>{
        return new Promise(async (resolve, reject) => {
            var pages = await browser.pages();

            if (pages.length > 0) {
                var page = pages[0];
                page.setBypassCSP(true);

                page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36");

                await page.goto('https://web.whatsapp.com', {
                    waitUntil: 'networkidle0',
                    timeout: 0
                });

                page.exposeFunction("log", (message) => {
                    console.log(message);
                });

                page.exposeFunction("getFile", utils.getFileInBase64);
                resolve(page);
            }else{
                reject("Have chromium pages open");
            }
        });
    }

    public async sendMessage(page: puppeteer.Page, data: any){
        return new Promise(async (resolve, reject) => {
            try {
                
                if (data.type == 'text') {
                    await page.evaluate(`
                            var link = document.createElement("a");
                            link.setAttribute("href", "whatsapp://send?phone=${data.to}");
                            document.body.append(link);
                            link.click();
                            document.body.removeChild(link);
                        `);

                    await utils.delay(300);

                    var res = await page.evaluate(`window.WAPI.sendMessage2('` + data.to + `@c.us','` + data.body + `');`);

                    if (res) {
                        resolve({ status: true });
                    } else {
                        resolve({ status: false, message: 'Invalid number' });
                    }
                }else if (data.type == 'media') {
                    //var res = await main.page.evaluate(``);
                }
            }catch(err){
                resolve({ status: false, message: 'Invalid number' });
            }
        });
    }

    public async login(page: puppeteer.Page, port: number): Promise<void>{
        this.isLogin = await this.checkLogin(page, port);
        
        if(!this.isLogin){
            await this.getAndShowQR(page, port);
        }
    }

    private async checkLogin(page: puppeteer.Page, port: number){
        await utils.delay(10000);
        var output: boolean = await page.evaluate("localStorage['last-wid']") as boolean;

        if (output) {
            logger.writeLines.info("Looks like you are already logged in");
            this.injectJS(page, port);
        }else{
            logger.writeLines.info("You are not logged in. Please scan the QR below");
        }

        return output ? true : false;
    }

    private async injectJS(page: puppeteer.Page, port: number){
        return await page.waitForSelector('[data-icon=laptop]')
        .then(async () => {
            var filepath = path.join("../scripts/socketIO.js");
            await page.addScriptTag({ path: require.resolve(filepath) });


            filepath = path.join("../scripts/wapi.js");
            await page.addScriptTag({ path: require.resolve(filepath) });

            filepath = path.join("../scripts/inject.js");
            await page.evaluate(`var socket = io("http://localhost:${port}");`);
            await page.addScriptTag({ path: require.resolve(filepath) });
            return true;
        })
        .catch((err) => {
            console.log(err)
            return false;
        });
    }

    private async getAndShowQR(page: puppeteer.Page, port: number){
        try{
            var scanme = "img[alt='Scan me!'], canvas";
            await page.waitForSelector(scanme);
            var imageData = await page.evaluate(`document.querySelector("${scanme}").parentElement.getAttribute("data-ref")`);
            qrcode.generate(imageData, { small: true });

            this.isLogin = await this.injectJS(page, port);

            while(!this.isLogin){
                await utils.delay(300);
                this.isLogin = await this.injectJS(page, port);
            }

        }catch(err){
            logger.writeLines.error("Check error=");
            var inf: string = await page.evaluate('document.getElementsByClassName("landing-title version-title")[0].textContent') as string;
            if (inf.includes("O WhatsApp funciona com Google Chrome")) {
                logger.writeLines.error("Delete chromium-data folder!\n");
                process.exit(0);
            }else{
                logger.writeLines.error(inf);
                process.exit(0);
            }
        }
    }
}

export default new Whatsapp();