import path from "path";
import mime from "mime";
import fs from "fs";

class Utils {

    public async getFileInBase64(filename: string){
        return new Promise((resolve, reject) => {
            try {
                filename = path.join(process.cwd(), filename);
                const fileMime = mime.getType(filename);
                var file = fs.readFileSync(filename, { encoding: 'base64' });
                resolve(`data:${fileMime};base64,${file}`);
            } catch (error) {
                reject(error);
            }
        });
    }

    public async delay(ms: number){
        return new Promise(resolve => {
            setTimeout(resolve, ms);
        });
    };
}

export default new Utils();