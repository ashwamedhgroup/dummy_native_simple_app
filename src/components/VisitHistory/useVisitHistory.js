import { useEffect, useState } from "react";
import apiClient from "../../api/client";

const useVisitHistory = (location_id) => {
  const [remarksList, setRemarksList] = useState([]);

  useEffect(() => {
    const fetchVisitHistory = async () => {
      if (!location_id) return;

      try {
        const response = await apiClient.get(
          `track/visit-history/${location_id}`
        );

        console.log("Visit History Response:", response.data);
        if (response.ok && response.data) {
          const sorted = [...response.data.visit_history].sort(
            (a, b) =>
              new Date(b.visit_start_time) - new Date(a.visit_start_time)
          );
          setRemarksList(sorted);
        } else {
          console.error("Fetch failed:", response.problem);
        }
      } catch (err) {
        console.error("Visit history error:", err);
      }
    };

    fetchVisitHistory();
  }, [location_id]);

  return remarksList;
};

export default useVisitHistory;
