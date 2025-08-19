import * as secureStore from "expo-secure-store";

const key = "authToken";

const storeToken = async (authToken) => {
    try {
        await secureStore.setItemAsync(key, authToken);
    } catch (error) {
        console.error("Error storing the auth token:", error);
    }
};

const getToken = async () => {
    try {
        const token = await secureStore.getItemAsync(key);
        return token;
    } catch (error) {
        console.error("Error getting the auth token:", error);
        return null;
    }
};

const getUser = async () => {
    try {
        const partialToken = await getToken();

        if (!partialToken) {
            console.warn("Token not found in storage");
            return null;
        }

        const token = partialToken.replace(/"/g, "");
        return token;
    } catch (error) {
        console.error("Error decoding the auth token:", error);
        return null;
    }
};

const removeToken = async () => {
    try {
        await secureStore.deleteItemAsync(key);
    } catch (error) {
        console.error("Error removing the auth token:", error);
    }
};

export default {
    storeToken,
    getToken,
    getUser,
    removeToken,
};
