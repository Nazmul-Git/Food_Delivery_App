const { MONGODB_USERNAME, MONGODB_PASSWORD } = process.env;

export const connectionUrl = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@cluster0.zwuas.mongodb.net/restaurantDB?retryWrites=true&w=majority&appName=Cluster0`;