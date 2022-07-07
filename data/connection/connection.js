const mongoose = require("mongoose");
const url = 'mongodb://localhost:27017/school'; // mongoose connection URL

const connection = async () => {
    try {
        await mongoose.connect(url, {
            autoIndex: true
        });
    }
    catch (error) {
        console.log("Error occured connecting mongoose :", error);
    }
}

(async () => {
    await connection();
})();

module.exports = connection;