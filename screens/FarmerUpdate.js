import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import apiClient from "../src/api/client";
import SubmitButton from "../src/components/form/appComponents/SubmitButton";
import AppButton from "../src/components/form/appComponents/AppButton";
import { FarmerSchema } from "../src/validations/FarmerSchema";
import useFarmerForm from "../src/hooks/useMasterData";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function FarmerUpdateScreen() {
  const insets = useSafeAreaInsets();
  console.log("🔥 FarmerUpdateScreen - Component initialized");


  const route = useRoute();
  const navigation = useNavigation();
  const farmerId = route.params?.id;


  const [farmerData, setFarmerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [cropOptions, setCropOptions] = useState([]);


  const {
    states,
    districts,
    talukas,
    irrigationTypes,
    products,
    loadStates,
    loadDistricts,
    loadTalukas,
    loadIrrigation,
    loadProducts,
    loadCrops,
  } = useFarmerForm();
  const [dropdowns, setDropdowns] = useState({
    state: false,
    district: false,
    taluka: false,
    irrigation: false,
    suggestedProduct: false,
    recommendedProduct: false,
  });


  const [formState, setFormState] = useState({
    state: null,
    district: null,
    taluka: null,
    irrigation: null,
    suggestedProduct: null,
    recommendedProduct: null,
  });
  useEffect(() => {
    fetchFarmerData();
  }, [farmerId]);


  const fetchFarmerData = async () => {
    console.log("🔄 fetchFarmerData - Starting fetch process");
    try {
      setLoading(true);
      console.log("🔄 fetchFarmerData - Loading set to true");


      // Load crop options first
      console.log("🌾 fetchFarmerData - Loading crop options");
      await loadCrops(setCropOptions);
      console.log("✅ fetchFarmerData - Crop options loaded");


      // Load other dropdowns first
      await loadStates();


      await loadIrrigation();


      await loadProducts();


      const response = await apiClient.get(`farmer/${farmerId}/`);
      const data = response.data;


      setFarmerData(data);


      if (data.state?.id) {
        await loadDistricts(data.state.id);
      }


      if (data.district?.id) {
        await loadTalukas(data.district.id);
      }


      console.log("🔧 fetchFarmerData - Setting formState from fetched data");
      setFormState({
        state: data.state?.id || null,
        district: data.district?.id || null,
        taluka: data.taluka?.id || null,
        irrigation: data.crop_details?.[0]?.irrigation || null,
        suggestedProduct: data.crop_details?.[0]?.current_product_used
          ? parseInt(data.crop_details[0].current_product_used)
          : null,
        recommendedProduct: data.crop_details[0].recommend?.id || null
      });


      if (data.crop_details && data.crop_details.length > 0) {
        const crops = data.crop_details.map(cd => ({
          label: cropOptions.find(c => c.id === cd.crop.id)?.name || cd.crop.name,
          value: cd.crop.id,
          acre: cd.acre ? cd.acre.toString() : "0"
        }));


        setSelectedCrops(crops);


        const firstCrop = data.crop_details[0];


        setFormState(prev => ({
          ...prev,
          irrigation: firstCrop.irrigation || null,
          suggestedProduct: firstCrop.current_product_used
            ? parseInt(firstCrop.current_product_used)
            : null,
          recommendedProduct: firstCrop.recommend?.id || null,
        }));
      }
      else {
        console.log("⚠️ fetchFarmerData - No crop details found");
      }
    } catch (error) {
      console.error("❌ fetchFarmerData - Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });


      if (error.response?.status === 401) {
        Alert.alert("Authentication Error", "Please login again");
      } else if (error.response?.status === 404) {
        Alert.alert("Error", "Farmer not found");
      } else {
        Alert.alert("Error", "Failed to load farmer data");
      }
      navigation.goBack();
    } finally {
      console.log("🔄 fetchFarmerData - Setting loading to false");
      setLoading(false);
    }
  };


  const handleSubmit = async (values) => {
    try {
      setUpdating(true);
      if (selectedCrops.length === 0) {
        Alert.alert("Validation Error", "Please select at least one crop.");
        setUpdating(false);
        return;
      }


      const invalidCrops = selectedCrops.filter(
        (crop) =>
          !crop.value ||
          !crop.acre ||
          crop.acre.trim() === "" ||
          parseFloat(crop.acre) <= 0
      );
      if (invalidCrops.length > 0) {
        Alert.alert(
          "Validation Error",
          "Please ensure all selected crops have valid crop type and acre values greater than 0."
        );
        setUpdating(false);
        return;
      }


      if (!formState.state || !formState.district || !formState.taluka) {
        Alert.alert(
          "Validation Error",
          "Please select State, District, and Taluka."
        );
        setUpdating(false);
        return;
      }


      const payload = {
        id: farmerId,
        farmer_name: values.name.trim(),
        mobile_no: values.mobile.trim(),
        city: values.city.trim(),
        total_acre: parseFloat(values.totalAcre),
        state: {
          id: formState.state,
          name: states.find((s) => s.value === formState.state)?.label || "",
        },
        district: {
          id: formState.district,
          name:
            districts.find((d) => d.value === formState.district)?.label || "",
        },
        taluka: {
          id: formState.taluka,
          name: talukas.find((t) => t.value === formState.taluka)?.label || "",
        },
        location_latitude: farmerData.location_latitude || 0,
        location_longitude: farmerData.location_longitude || 0,
        crop_details: selectedCrops.map((crop) => ({
          crop: crop.value,
          acre: parseFloat(crop.acre).toFixed(2),
          irrigation: formState.irrigation || "",
          current_product_used: formState.suggestedProduct
            ? formState.suggestedProduct.toString()
            : "",
          recommend: formState.recommendedProduct || "",
        })),
        remark: values.remark?.trim() || "",
      };


      try {
        const url = `farmer/${farmerId}/`;


        await apiClient.patch(url, payload);


        Alert.alert("Success", "Farmer updated successfully", [
          {
            text: "OK",
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } catch (apiError) {
        console.error("❌ handleSubmit - API Error:", apiError);
        console.error("❌ handleSubmit - API Error details:", {
          message: apiError.message,
          response: apiError.response?.data,
          status: apiError.response?.status,
          config: apiError.config,
        });


        let errorMsg = "Failed to update farmer";


        if (apiError.response?.status === 401) {
          errorMsg = "Authentication failed. Please login again.";
        } else if (apiError.response?.status === 400) {
          errorMsg =
            apiError.response?.data?.detail ||
            apiError.response?.data?.message ||
            "Invalid data provided";
        } else if (apiError.response?.status === 404) {
          errorMsg = "Farmer not found";
        } else if (apiError.response?.data) {
          errorMsg =
            typeof apiError.response.data === "string"
              ? apiError.response.data
              : JSON.stringify(apiError.response.data);
        }


        Alert.alert("Update Failed", errorMsg);
      }
    } catch (error) {
      console.error("❌ handleSubmit - Error details:", {
        message: error.message,
        stack: error.stack,
      });
      Alert.alert("Error", "Something went wrong while updating farmer.");
    } finally {
      setUpdating(false);
    }
  };


  console.log("🎨 FarmerUpdateScreen - Current state:", {
    loading,
    updating,
    farmerData: !!farmerData,
    selectedCropsCount: selectedCrops.length,
    cropModalVisible,
  });


  if (loading) {
    return (


      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading farmer data...</Text>
      </View>


    );
  }


  if (!farmerData) {
    return (


      <View style={styles.loadingContainer}>
        <Text>No farmer data found</Text>
        <AppButton
          title="Go Back"
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>


    );
  }
  return (

    <>

      <View style={{ flex: 1, paddingBottom: insets.bottom }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}

        >
          <View style={styles.headingContainer}>
            <Text style={styles.modalTitle}>Update Farmer</Text>
          </View>

          <FlatList
            data={[{}]}
            keyExtractor={() => "form"}
            contentContainerStyle={styles.modalContainer}
            showsVerticalScrollIndicator={false}
            renderItem={() => (
              <>

                <Formik
                  initialValues={{
                    name: farmerData.farmer_name || "",
                    mobile: farmerData.mobile_no || "",
                    city: farmerData.city || "",
                    totalAcre: farmerData.total_acre
                      ? farmerData.total_acre.toString()
                      : "",
                    remark: farmerData.remark || "",
                  }}
                  validationSchema={FarmerSchema}
                  onSubmit={handleSubmit}
                  enableReinitialize={true}

                >
                  {({
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    values,
                    errors,
                    touched,
                    isSubmitting,
                  }) => {
                    return (
                      <>
                        <TextInput
                          style={styles.input}
                          placeholder="Name *"
                          onChangeText={(text) => {
                            handleChange("name")(text);
                          }}
                          onBlur={handleBlur("name")}
                          value={values.name}
                        />
                        {touched.name && errors.name && (
                          <Text style={styles.error}>{errors.name}</Text>
                        )}


                        <TextInput
                          style={styles.input}
                          placeholder="Mobile *"
                          keyboardType="numeric"
                          maxLength={10}
                          onChangeText={(text) => {
                            handleChange("mobile")(text);
                          }}
                          onBlur={handleBlur("mobile")}
                          value={values.mobile}
                        />
                        {touched.mobile && errors.mobile && (
                          <Text style={styles.error}>{errors.mobile}</Text>
                        )}


                        <TextInput
                          style={styles.input}
                          placeholder="City *"
                          onChangeText={(text) => {
                            handleChange("city")(text);
                          }}
                          onBlur={handleBlur("city")}
                          value={values.city}
                        />
                        {touched.city && errors.city && (
                          <Text style={styles.error}>{errors.city}</Text>
                        )}


                        <TextInput
                          style={styles.input}
                          placeholder="Total Acre *"
                          keyboardType="numeric"
                          onChangeText={(text) => {
                            handleChange("totalAcre")(text);
                          }}
                          onBlur={handleBlur("totalAcre")}
                          value={values.totalAcre}
                        />
                        {touched.totalAcre && errors.totalAcre && (
                          <Text style={styles.error}>{errors.totalAcre}</Text>
                        )}


                        <View style={{ zIndex: 1000 }}>
                          <DropDownPicker
                            open={dropdowns.state}
                            setOpen={async (open) => {
                              setDropdowns((prev) => ({
                                ...prev,
                                state: open,
                                district: false,
                                taluka: false,
                              }));
                              if (open && states.length === 0) {
                                await loadStates();
                              }
                            }}
                            value={formState.state}
                            setValue={(callback) => {
                              const newStateValue =
                                typeof callback === "function"
                                  ? callback(formState.state)
                                  : callback;
                              setFormState((prev) => ({
                                ...prev,
                                state: newStateValue,
                                district: null,
                                taluka: null,
                              }));
                              if (newStateValue) {
                                console.log(
                                  "📊 Loading districts for state:",
                                  newStateValue
                                );
                                loadDistricts(newStateValue);
                              }
                            }}
                            items={states}
                            placeholder="Select State *"
                            searchable={true}
                            searchablePlaceholder="Search State"
                            listMode="SCROLLVIEW"
                            maxHeight={200}
                            searchableError={() => "State not found"}
                            style={styles.dropdown}
                            zIndex={1000}

                          />
                        </View>


                        {/* District Dropdown */}
                        <View style={{ zIndex: 900 }}>
                          <DropDownPicker
                            open={dropdowns.district}
                            setOpen={async (open) => {
                              setDropdowns((prev) => ({
                                ...prev,
                                district: open,
                                state: false,
                                taluka: false,
                              }));
                              if (
                                open &&
                                formState.state &&
                                districts.length === 0
                              ) {
                                await loadDistricts(formState.state);
                              }
                            }}
                            value={formState.district}
                            setValue={(callback) => {
                              const newDistrictValue =
                                typeof callback === "function"
                                  ? callback(formState.district)
                                  : callback;


                              setFormState((prev) => ({
                                ...prev,
                                district: newDistrictValue,
                                taluka: null,
                              }));
                              if (newDistrictValue) {
                                loadTalukas(newDistrictValue);
                              }
                            }}
                            items={districts}
                            placeholder="Select District *"
                            searchable={true}
                            searchablePlaceholder="Search District"
                            listMode="SCROLLVIEW"
                            maxHeight={200}
                            searchableError={() => "District not found"}
                            style={styles.dropdown}
                            zIndex={900}
                            zIndexInverse={100}
                          />
                        </View>


                        {/* Taluka Dropdown */}
                        <View style={{ zIndex: 800 }}>
                          <DropDownPicker
                            open={dropdowns.taluka}
                            setOpen={async (open) => {
                              setDropdowns((prev) => ({
                                ...prev,
                                taluka: open,
                                district: false,
                                state: false,
                              }));
                              if (
                                open &&
                                formState.district &&
                                talukas.length === 0
                              ) {
                                await loadTalukas(formState.district);
                              }
                            }}
                            value={formState.taluka}
                            setValue={(callback) => {
                              const newTalukaValue =
                                typeof callback === "function"
                                  ? callback(formState.taluka)
                                  : callback;
                              setFormState((prev) => ({
                                ...prev,
                                taluka: newTalukaValue,
                              }));
                            }}
                            items={talukas}
                            placeholder="Select Taluka *"
                            searchable={true}
                            searchablePlaceholder="Search Taluka"
                            listMode="SCROLLVIEW"
                            maxHeight={200}
                            searchableError={() => "Taluka not found"}
                            style={styles.dropdown}
                            zIndex={800}
                            zIndexInverse={200}
                          />
                        </View>


                        {/* Crop Details */}
                        <Text style={styles.sectionTitle}>Crop Details</Text>
                        <TouchableOpacity
                          style={styles.input}
                          onPress={() => {
                            setCropModalVisible(true);
                          }}
                        >
                          <Text
                            style={
                              selectedCrops.length > 0
                                ? styles.selectedText
                                : styles.placeholderText
                            }
                          >
                            {selectedCrops.length > 0
                              ? selectedCrops
                                .map((c) => `${c.label} (${c.acre} acre)`)
                                .join(", ")
                              : "Select Crop *"}
                          </Text>
                        </TouchableOpacity>


                        {/* Irrigation Type */}
                        <View style={{ zIndex: 700 }}>
                          <DropDownPicker
                            open={dropdowns.irrigation}
                            setOpen={(open) => {
                              if (open) {
                                loadIrrigation();
                              }
                              setDropdowns((prev) => ({
                                ...prev,
                                irrigation: open,
                                suggestedProduct: false,
                                recommendedProduct: false,
                              }));
                            }}
                            value={formState.irrigation}
                            setValue={(callback) => {
                              const newValue =
                                typeof callback === "function"
                                  ? callback(formState.irrigation)
                                  : callback;
                              setFormState((prev) => ({
                                ...prev,
                                irrigation: newValue,
                              }));
                            }}
                            items={irrigationTypes}
                            placeholder="Select Irrigation Type"
                             searchable={true}
                        searchablePlaceholder="Search Irrigation"
                        listMode="SCROLLVIEW"
                        maxHeight={200}
                        searchableError={() => "Irrigation not found"}
                            style={styles.dropdown}
                            zIndex={700}
                            zIndexInverse={300}
                          />
                        </View>


                        <View style={{ zIndex: 600 }}>
                          <DropDownPicker
                            open={dropdowns.suggestedProduct}
                            setOpen={(open) => {
                              if (open) {
                                console.log("📊 Loading products");
                                loadProducts();
                              }
                              setDropdowns((prev) => ({
                                ...prev,
                                suggestedProduct: open,
                                irrigation: false,
                                recommendedProduct: false,
                              }));
                            }}
                            value={formState.suggestedProduct}
                            setValue={(callback) => {
                              const newValue =
                                typeof callback === "function"
                                  ? callback(formState.suggestedProduct)
                                  : callback;


                              setFormState((prev) => ({
                                ...prev,
                                suggestedProduct: newValue,
                              }));
                            }}
                            items={products}
                            placeholder="Current Product Used"
                             searchable={true}
                        searchablePlaceholder="Search Suggested Product"
                        listMode="SCROLLVIEW"
                        maxHeight={200}
                        searchableError={() => "Suggested Product not found"}
                            style={styles.dropdown}
                            zIndex={600}
                            zIndexInverse={400}
                          />
                        </View>


                        <View style={{ zIndex: 500 }}>
                          <DropDownPicker
                            open={dropdowns.recommendedProduct}
                            setOpen={(open) => {
                              if (open) {
                                loadProducts();
                              }
                              setDropdowns((prev) => ({
                                ...prev,
                                recommendedProduct: open,
                                irrigation: false,
                                suggestedProduct: false,
                              }));
                            }}
                            value={formState.recommendedProduct}
                            setValue={(callback) => {
                              const newValue =
                                typeof callback === "function"
                                  ? callback(formState.recommendedProduct)
                                  : callback;


                              setFormState((prev) => ({
                                ...prev,
                                recommendedProduct: newValue,
                              }));
                            }}
                            items={products}
                            placeholder="Recommended Product"
                             searchable={true}
                        searchablePlaceholder="Search Recommended Product"
                        listMode="SCROLLVIEW"
                        maxHeight={200}
                        searchableError={() => "Recommended Product not found"}
                            style={styles.dropdown}
                            zIndex={500}
                            zIndexInverse={500}
                          />
                        </View>


                        <TextInput
                          style={styles.input}
                          placeholder="Remark"
                          multiline
                          numberOfLines={3}
                          onChangeText={(text) => {
                            handleChange("remark")(text);
                          }}
                          value={values.remark}
                        />


                        <SubmitButton
                          title={updating ? "Updating..." : "Update"}
                          style={styles.submitButton}
                          disabled={updating}
                          onPress={() => {
                            handleSubmit();
                          }}
                        />
                      </>
                    );
                  }}
                </Formik>
              </>
            )}
          />
        </KeyboardAvoidingView>
      </View>


      <Modal visible={cropModalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Crops</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCropModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>


          {cropOptions.map((crop, index) => {
            const selected = selectedCrops.find(
              (c) => c.value === crop.value
            );


            return (
              <View key={index} style={styles.cropRow}>
                <TouchableOpacity
                  onPress={() => {
                    if (selected) {
                      setSelectedCrops((prev) =>
                        prev.filter((c) => c.value !== crop.value)
                      );
                    } else {
                      setSelectedCrops((prev) => [
                        ...prev,
                        {
                          label: crop.label,
                          value: crop.value,
                          acre: "",
                        },
                      ]);
                    }
                  }}
                  style={styles.checkbox}
                >
                  <MaterialCommunityIcons
                    name={
                      selected ? "checkbox-marked" : "checkbox-blank-outline"
                    }
                    size={24}
                    color="black"
                  />
                  <Text style={{ marginLeft: 10 }}>{crop.label}</Text>
                </TouchableOpacity>


                {selected && (
                  <TextInput
                    style={styles.acreInput}
                    placeholder="Acre"
                    keyboardType="numeric"
                    value={selected.acre}
                    onChangeText={(text) => {
                      setSelectedCrops((prev) =>
                        prev.map((c) =>
                          c.value === crop.value ? { ...c, acre: text } : c
                        )
                      );
                    }}
                  />
                )}
              </View>
            );
          })}


          <View style={styles.modalButtons}>
            <AppButton
              title="Cancel"
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => {
                setCropModalVisible(false);
              }}
            />
            <AppButton
              title="Done"
              style={[styles.modalButton, styles.doneButton]}
              onPress={() => {
                const isValid = selectedCrops.every(
                  (crop) =>
                    crop.acre &&
                    crop.acre.trim() !== "" &&
                    parseFloat(crop.acre) > 0
                );


                if (!isValid) {
                  Alert.alert(
                    "Validation Error",
                    "Please enter valid acre value (greater than 0) for all selected crops."
                  );
                  return;
                }


                setCropModalVisible(false);
              }}
            />
          </View>
        </ScrollView>
      </Modal>
    </>

  );
}


const styles = StyleSheet.create({
  cancelButton: {
    marginBottom: 12
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headingContainer: {
    marginHorizontal: 3
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 6,
    borderRadius: 5,
  },
  dropdown: {
    marginVertical: 6,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 20,
  },
  cropRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 8,
    padding: 10,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  acreInput: {
    borderWidth: 1,
    borderColor: "#aaa",
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: 90,
    borderRadius: 6,
    marginLeft: 10,
    backgroundColor: "#fff",
  },
});


export default FarmerUpdateScreen;





