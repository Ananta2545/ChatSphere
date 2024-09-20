const messageModel = require("../model/messageModel");

module.exports.addMessage = async(req, res, next)=>{
    try{
        const {from, to, message} = req.body;// fetching the message here 
        const data = messageModel.create({// creating the model with the data fetched 
            message: {text: message},
            users: [from, to],
            sender: from,
        });
        if(data) return res.json({msg:"Messages added Successfuly"})
        else return res.json({ msg: "Failed to add message to the database"})
    }
    catch(ex){
        next(ex);
    }
}
module.exports.getAllMessage = async(req, res, next)=>{
    try{
        const { from, to } = req.body;
        const messages = await messageModel.find({
            users: {
                $all: [from, to],// This condition finds messages where both the from and to users are present in the users array. The $all operator ensures that the messages are between these two users.
            },
        }).sort({ updatedAt: 1});// The results are sorted in ascending order (1) based on the updatedAt field, so the oldest messages come first.

        const projectMessages = messages.map((msg)=>{
            return{
                fromSelf: msg.sender.toString() === from, //This checks if the message was sent by the user (from). If the msg.sender matches from, it sets fromSelf to true.
                message:msg.message.text,//This extracts the text of the message and assigns it to the message property.
            };
        });
        return res.json(projectMessages)
    }catch(ex){
        next(ex);
    }
}