const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

export const connectionUrl = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.ovytz.mongodb.net/restaurantsDatabase?retryWrites=true&w=majority&appName=Cluster0`;