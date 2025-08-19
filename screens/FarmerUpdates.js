import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import apiClient from "../src/api/client";
import useMasterData from "../src/hooks/useMasterData";
import DESIGN from "../src/theme";

/** ✅ Our own Form Validation Schema (no predefined FarmerSchema) */
const FarmerValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile is required"),
  city: Yup.string().required("City is required"),
  totalAcre: Yup.number()
    .typeError("Total Acre must be a number")
    .positive("Must be greater than zero")
    .required("Total Acre is required"),
  state: Yup.number().nullable().required("State is required"),
  district: Yup.number().nullable().required("District is required"),
  taluka: Yup.number().nullable().required("Taluka is required"),
  remark: Yup.string().required("Remark is required"),
});

const FarmerDetailUpdates = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const farmerId = route.params?.id;

  const { states, districts, talukas, loadStates, loadDistricts, loadTalukas } =
    useMasterData();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [farmerData, setFarmerData] = useState(null);

  const [dropdowns, setDropdowns] = useState({
    state: false,
    district: false,
    taluka: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await loadStates();

        const res = await apiClient.get(`farmer/${farmerId}/`);
        const data = res.data;
        if (!data) {
          Alert.alert("Error", "Farmer not found", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
          return;
        }

        setFarmerData(data);

        if (data.state?.id) await loadDistricts(data.state.id);
        if (data.district?.id) await loadTalukas(data.district.id);
      } catch (err) {
        Alert.alert("Error", "Failed to load farmer data", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [farmerId]);

  const handleUpdate = async (values) => {
    try {
      setUpdating(true);
      const payload = {
        id: farmerId,
        farmer_name: values.name?.trim(),
        mobile_no: values.mobile?.trim(),
        city: values.city?.trim(),
        total_acre: parseFloat(values.totalAcre || 0).toFixed(2),
        state: { id: values.state },
        district: { id: values.district },
        taluka: { id: values.taluka },
        location_latitude: farmerData?.location_latitude || 0,
        location_longitude: farmerData?.location_longitude || 0,
        
        remark: values.remark?.trim() || "",
      };

      const res = await apiClient.patch(`farmer/${farmerId}/`, payload);
      if (res.status >= 200 && res.status < 300) {
        Alert.alert("Success", "Farmer updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Update failed");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong while updating farmer");
    } finally {
      setUpdating(false);
    }
  };

  if (loading || !farmerData) {
    return (
      <ActivityIndicator
        size="large"
        color={DESIGN.colors.primary}
        style={{ marginTop: DESIGN.spacing.lg }}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Update Farmer</Text>

        <Formik
          initialValues={{
            name: farmerData.farmer_name || "",
            mobile: farmerData.mobile_no || "",
            city: farmerData.city || "",
            totalAcre: farmerData.total_acre ? farmerData.total_acre.toString() : "",
            state: farmerData.state?.id || null,
            district: farmerData.district?.id || null,
            taluka: farmerData.taluka?.id || null,
            remark: farmerData.remark || "",
          }}
          validationSchema={FarmerValidationSchema}
          onSubmit={handleUpdate}
          enableReinitialize
        >
          {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, touched, errors }) => (
            <>
              <TextInput
                style={styles.input}
                placeholder="Name *"
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
              />
              {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Mobile *"
                keyboardType="numeric"
                maxLength={10}
                onChangeText={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
                value={values.mobile}
              />
              {touched.mobile && errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

              <TextInput
                style={styles.input}
                placeholder="City *"
                onChangeText={handleChange("city")}
                onBlur={handleBlur("city")}
                value={values.city}
              />
              {touched.city && errors.city && <Text style={styles.error}>{errors.city}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Total Acre *"
                keyboardType="numeric"
                onChangeText={handleChange("totalAcre")}
                onBlur={handleBlur("totalAcre")}
                value={values.totalAcre}
              />
              {touched.totalAcre && errors.totalAcre && <Text style={styles.error}>{errors.totalAcre}</Text>}

              {/* State */}
              <DropDownPicker
                open={dropdowns.state}
                setOpen={(open) => setDropdowns({ ...dropdowns, state: open, district: false, taluka: false })}
                value={values.state}
                setValue={(val) => {
                  setFieldValue("state", val());
                  setFieldValue("district", null);
                  setFieldValue("taluka", null);
                  if (val()) loadDistricts(val());
                }}
                items={states}
                placeholder="Select State *"
                style={styles.dropdown}
                zIndex={1000}
              />
              {touched.state && errors.state && <Text style={styles.error}>{errors.state}</Text>}

              {/* District */}
              <DropDownPicker
                open={dropdowns.district}
                setOpen={(open) => setDropdowns({ ...dropdowns, district: open, state: false, taluka: false })}
                value={values.district}
                setValue={(val) => {
                  setFieldValue("district", val());
                  setFieldValue("taluka", null);
                  if (val()) loadTalukas(val());
                }}
                items={districts}
                placeholder="Select District *"
                style={styles.dropdown}
                zIndex={900}
              />
              {touched.district && errors.district && <Text style={styles.error}>{errors.district}</Text>}

              {/* Taluka */}
              <DropDownPicker
                open={dropdowns.taluka}
                setOpen={(open) => setDropdowns({ ...dropdowns, taluka: open, state: false, district: false })}
                value={values.taluka}
                setValue={(val) => setFieldValue("taluka", val())}
                items={talukas}
                placeholder="Select Taluka *"
                style={styles.dropdown}
                zIndex={800}
              />
              {touched.taluka && errors.taluka && <Text style={styles.error}>{errors.taluka}</Text>}

              <TextInput
                style={styles.input}
                placeholder="Remark *"
                multiline
                numberOfLines={3}
                onChangeText={handleChange("remark")}
                value={values.remark}
              />
              {touched.remark && errors.remark && <Text style={styles.error}>{errors.remark}</Text>}

              <TouchableOpacity
                style={[styles.button, updating && { opacity: 0.6 }]}
                onPress={() => {
                  setDropdowns({ state: false, district: false, taluka: false });
                  if (!updating) handleSubmit();
                }}
              >
                <Text style={styles.buttonText}>{updating ? "Updating..." : "Update Farmer"}</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, padding: DESIGN.spacing.md },
  heading: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 16, color: DESIGN.colors.primary },
  input: { borderWidth: 1, borderColor: DESIGN.colors.textTertiary, padding: 10, marginVertical: 6, borderRadius: 5 },
  dropdown: { marginVertical: 6 },
  error: { color: "red", fontSize: 12, marginBottom: 5 },
  button: { marginTop: 20, backgroundColor: DESIGN.colors.primary, padding: 12, borderRadius: 6, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default FarmerDetailUpdates;
