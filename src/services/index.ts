import { getConfig } from "../config/";
import { IConfig } from "../interfaces/";

import { logger } from "./logger";

import socketIo, {Server} from "socket.io";
import Queue from "better-queue";
import { Chromium } from "./chromium";

class Service {

    private config : IConfig;
    private io: Server = null;
    private queue: any = {};

    constructor(){
        this.config = getConfig();
    }

    public async run(){

        logger.writeLines.info("Starting Socket.IO ...");
        this.io = socketIo(this.config.port);
        logger.writeLines.success(`Socket.IO running on port ${this.config.port}`);

        logger.writeLines.info("Downloading Chromium ...");
        const chromiumResults = await Chromium.downloadChromium(); 
        logger.writeLines.success("Downloading Chromium ... done!");
        console.log(chromiumResults);

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