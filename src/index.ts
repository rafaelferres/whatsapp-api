import { Service } from "./services";

var service = new Service();

service.run();

service.event.on("receive", (data) => {
    console.log(data);
});

service.event.on("send", (data) => {
    console.log(data);
});