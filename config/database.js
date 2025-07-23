const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/devmatch_project');

module.exports = async function connectToDatabase(){
    try{
        await mongoose.connect('mongodb://localhost:27017/devmatch_project', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to the database successfully');
    }catch(error){
        console.error('Error connecting to the database', error);
    }
}