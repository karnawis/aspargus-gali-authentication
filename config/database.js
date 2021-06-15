const mongoose = require('mongoose')

const connectDB = async () => {
    try{
        const connectionDB = await mongoose.connect(process.env.DB_CONNECT,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
            })
            console.log(`MongoDB Connected: ${connectionDB.connection.host}`)
    
        } catch(error) {
            console.error(error)
            process.exit(1)
    }
}

module.exports = connectDB