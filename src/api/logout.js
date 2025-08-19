import apiClient from "./client";


const logoutAction = async () => {
    try {
        const response = await apiClient.post('auth/logout/', null)
        return response;
        
    } catch (error) {
        console.error("Logout error:", error)
    }
};
export default {
    logoutAction,
}

