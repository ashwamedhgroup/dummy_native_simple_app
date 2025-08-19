import apiClient from "./client";

const getDashboardData = async () => {
    try {
        const response = await apiClient.get('track/dashboard/today/');
        
        if (response.ok && response.data) {
            return {
                success: true,
                data: response.data
            };
        } else {
            return {
                success: false,
                error: 'Failed to fetch dashboard data'
            };
        }
        
    } catch (error) {
        console.error("Dashboard API error:", error);
        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
};

export default {
    getDashboardData,
};
