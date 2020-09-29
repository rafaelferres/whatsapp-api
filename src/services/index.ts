import { getConfig } from "../config/";
import { IConfig } from "../interfaces/";

import { logger } from "./logger";
import puppeteer from "puppeteer-core";

import socketIo, {Server as ServerIO} from "socket.io";
import Queue from "better-queue";
import { Chromium } from "./chromium";
import WhatsApp from "./whatsapp";
import utils from "./utils";
import http, {Server} from "http";
import express from "express";

class Service {

    private config : IConfig;
    private io: ServerIO = null;
    private queue: { message_queue: Queue } = { message_queue: null};
    private chromiumInstall: any;
    private browser: puppeteer.Browser;
    private page: puppeteer.Page;
    private http: Server;
    private app: express.Application;

    constructor(){
        this.config = getConfig();
    }

    private buildServer(){
        this.app = express();
        this.app.use(express.json());
        this.http = http.createServer(this.app);
        this.io = socketIo(this.http);
    }

    private buildQueue(){
        this.queue.message_queue = new Queue(async (input, cb) => {
            await utils.delay(500);
            if (input) {
                try {
                    var x: any = await WhatsApp.sendMessage(this.page, input);

                    if (x.status == true) {
                        logger.writeLines.success('Message ' + input.type + ' sended to ' + input.to);
                    }else{
                        logger.writeLines.error('Message ' + input.type + ' is not sended to ' + input.to + ' because : ' + x.message);
                    }
                }catch(err){

                }
            }
            cb(null, input);
        }, { concurrent: 1 });
    }

    public async run(){
        logger.writeLines.info("Starting Server ...");
        this.buildServer();
        await this.http.listen(this.config.port);
        logger.writeLines.success(`Server running on port ${this.config.port}`);

        this.io.on("connect" ,(socket) => {
            socket.on("message", (data) => {
                console.log(data);
            });
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
        await WhatsApp.login(this.page, this.config.port);
        logger.writeLines.success("Login Whatsapp ... done!");

        while (!WhatsApp.isLogin) {
            await utils.delay(300);
        }
        
        logger.writeLines.info("Building queue ...");
        await utils.delay(5000);
        await this.buildQueue();
        logger.writeLines.success("Building queue ... done!");

        logger.writeLines.success("Running ...");

    }
}

export {Service};