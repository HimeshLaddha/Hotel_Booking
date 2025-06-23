import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async ()=>{
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

        // Getting data from the webhook
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        }

        await whook.verify(JSON.stringify(req.body), headers)

        // Getting data from body request
        const {data, type} = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            Image: data.image_url
        }

        switch (type) {
            case "user.created":{
                await User.create(userData);
                break;
            }
            case "user.updated":{
                await User.findByIdAndUpdate(data._id, userData);
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(data._id);
                break;
            }
            default:
                break;
        }

        res.json({success: true, message: "Webhook eceived"})
    } catch (error) {
        res.json({success: false, message: error.message});
        console.log(error.message);
    }
}

export default clerkWebhooks;