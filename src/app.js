const server = require("./server");
server.then((hapi) => {
    console.log(`NoDesign Server Api on `);
    hapi.start();
});
