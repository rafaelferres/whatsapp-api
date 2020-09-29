import colors from "colors";

class Logger {
    public writeLines : any = {};

    /**
     * Initialize functions logs
     */
    constructor(){
        this.writeLines.error = (message: string) => {
			      this.msg(colors.red(message));
        }
        
        this.writeLines.success = (message: string) => {
            this.msg(colors.green(message));
        }

        this.writeLines.warning = (message: string) => {
			this.msg(colors.yellow(message));
        }
        
        this.writeLines.info = (message: string) => {
			this.msg(colors.white(message));
		}
    }

    /**
     * Format messages
     * @param message Message
     */
    private msg (message: any) {
		var b = (message: any) => {
			10 > message && (message = "0" + message);
			return message;
		}
		var curDate = new Date,
			curHours = b(curDate.getHours()),
			curMinutes = b(curDate.getMinutes()),
			curSeconds = b(curDate.getSeconds());
		console.log("[" + curHours + ":" + curMinutes + ":" + curSeconds + "] " + message);
	}
}

var logger = new Logger();

export { logger };