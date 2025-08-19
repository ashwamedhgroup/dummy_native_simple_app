import { useState, useEffect } from 'react';
import dashboardApi from '../api/dashboard';

const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await dashboardApi.getDashboardData();
      
      if (result.success) {
        setDashboardData(result.data);
      } else {
        setError(result.error);
        console.error('Dashboard API Error:', result.error);
      }
    } catch (err) {
      setError(err.message);
      console.error('Dashboard Hook Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDashboard = async () => {
    await fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    dashboardData,
    isLoading,
    error,
    refreshDashboard,
    fetchDashboardData
  };
};

export default useDashboard;
