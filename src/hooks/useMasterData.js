import { useState } from "react";
import * as api from "../api/form";

const toDropdown = (data, labelKey = "name", valueKey = "id") =>
  data?.map((item) => ({
    label: item[labelKey],
    value: item[valueKey],
  })) || [];

export default function useFarmerForm() {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [talukas, setTalukas] = useState([]);
  const [irrigationTypes, setIrrigationTypes] = useState([]);
  const [products, setProducts] = useState([]);
  const [crops, setCrops] = useState([]);

  const loadStates = async () => {
    try {
      const data = await api.getStates();
      setStates(toDropdown(data));
    } catch (err) {
      console.error("Failed to load states:", err);
    } finally {
    }
  };

  const loadDistricts = async (stateId) => {
    try {
      const data = await api.getDistricts(stateId);
      setDistricts(toDropdown(data));
    } catch (err) {
      console.error("Failed to load districts:", err);
    } finally {
    }
  };

  const loadTalukas = async (districtId) => {
    try {
      const data = await api.getTalukas(districtId);
      setTalukas(toDropdown(data));
    } catch (err) {
      console.error("Failed to load talukas:", err);
    } finally {
    }
  };

  const loadIrrigation = async () => {
    try {
      const data = await api.getIrrigationTypes();
      setIrrigationTypes(toDropdown(data, "key", "value"));
    } catch (err) {
      console.error("Failed to load irrigation types:", err);
    } finally {
    }
  };

  const loadProducts = async () => {
    try {
      const data = await api.getProducts();
      setProducts(toDropdown(data));
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
    }
  };

  const loadCrops = async (setLocalState = null) => {
    try {
      const data = await api.getCrops();
      const formatted = toDropdown(data);

      if (setLocalState) setLocalState(formatted);
      else setCrops(formatted);

      return formatted;
    } catch (err) {
      console.error("Failed to load crops:", err);
      return [];
    } finally {
    }
  };

  return {
    states,
    districts,
    talukas,
    irrigationTypes,
    products,
    crops,
    loadStates,
    loadDistricts,
    loadTalukas,
    loadIrrigation,
    loadProducts,
    loadCrops,
  };
}
