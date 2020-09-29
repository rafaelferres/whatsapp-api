import { getConfig } from "../config/";
import { IConfig } from "../interfaces/";

import { logger } from "./logger";
import puppeteer from "puppeteer-core";

import socketIo, {Server} from "socket.io";
import Queue from "better-queue";
import { Chromium } from "./chromium";
import WhatsApp from "./whatsapp";
import utils from "./utils";

class Service {

    private config : IConfig;
    private io: Server = null;
    private queue: any = {};
    private chromiumInstall: any;
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;

    constructor(){
        this.config = getConfig();
    }

    public async run(){

        logger.writeLines.info("Starting Socket.IO ...");
        this.io = socketIo(this.config.port);
        logger.writeLines.success(`Socket.IO running on port ${this.config.port}`);

        this.io.on("connect" ,(socket) => {
            socket.on("message", (data) => {
                console.log(data);
            })
        });

        logger.writeLines.info("Downloading Chromium ...");
        this.chromiumInstall = await Chromium.downloadChromium(); 
        logger.writeLines.success("Downloading Chromium ... done!");
        

        logger.writeLines.info("Check Chromium ...");
        await Chromium.checkChromiumVersions(this.chromiumInstall.revisionInfo.folderPath); 
        logger.writeLines.success("Check Chromium ... done!");

        logger.writeLines.info("Launching Chromium ...");
        this.browser = await WhatsApp.launch(this.chromiumInstall.revisionInfo.executablePath);
        logger.writeLines.success("Launching Chromium ... done!");

        logger.writeLines.info("Opening Whatsapp ...");
        this.page = await WhatsApp.open(this.browser);
        logger.writeLines.success("Opening Whatsapp ... done!");

        logger.writeLines.info("Login Whatsapp ...");
        await WhatsApp.login(this.page);
        logger.writeLines.success("Login Whatsapp ... done!");

        while (!WhatsApp.isLogin) {
            await utils.delay(300);
        }

        logger.writeLines.success("Running ...");
        /*
        this.queue.message = new Queue(async (input, cb) => {
            cb(null, input);
        }, { concurrent: 1 });
        */
        /*this.io.on("connection", () => {
            console.log("a");
        });*/
    }
}

export {Service};