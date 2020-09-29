import * as dotenv from "dotenv";
import { IConfig } from "../interfaces/";

dotenv.config();

/**
 * Get config service configuration
 * @returns service configuration (IConfig)
 */
function getConfig(): IConfig{
    var config : IConfig = {
        token: process.env.TOKEN,
        port: Number(process.env.PORT)
    };

    return config;
}


export { getConfig };