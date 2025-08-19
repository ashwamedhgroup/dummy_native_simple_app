import { useNavigation, useRoute } from "@react-navigation/native";
import { Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as Yup from "yup";
import apiClient from "../src/api/client";
import AppButton from "../src/components/form/appComponents/AppButton";
import DESIGN from "../src/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STATE_URL = process.env.EXPO_PUBLIC_STATE_URL;
const DISTRICT_URL = process.env.EXPO_PUBLIC_DISTRICT_URL;
const TALUKA_URL = process.env.EXPO_PUBLIC_TALUKA_URL;

const dealerSchema = Yup.object().shape({
  shopeName: Yup.string().required("Shope name is required"),
  ownerName: Yup.string().required("Owner name is required"),
  mobile: Yup.string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Mobile number is required"),
  remark: Yup.string().required("Remark is required"),
});

const DealerUpdateScreen = () => {
   const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();
  const dealerId = route.params?.id;

  const [dealer, setDealer] = useState(null);
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ latitude: 0, longitude: 0 });
  const [loading, setLoading] = useState(true);

  const [dropdowns, setDropdowns] = useState({
    state: false,
    district: false,
    taluka: false,
    agreement_status: false,
  });

  const [formState, setFormState] = useState({
    state: null,
    district: null,
    taluka: null,
    agreement_status: null,
  });

  const [stateItems, setStateItems] = useState([]);
  const [districtItems, setDistrictItems] = useState([]);
  const [talukaItems, setTalukaItems] = useState([]);

  const selectedState = useRef(null);
  const selectedDistrict = useRef(null);
  const selectedTaluka = useRef(null);

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const response = await apiClient.get(`dealer/${dealerId}`);
        const data = response.data;
        setDealer(data);
        setLocation(data.billing_address);
        setCoordinates({
          latitude: parseFloat(data.location_latitude),
          longitude: parseFloat(data.location_longitude),
        });

        const stateRes = await apiClient.get(`${STATE_URL}`);
        const sortedStates = stateRes.data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        const stateList = sortedStates.map((item) => ({
          label: item.name,
          value: item.id,
        }));
        setStateItems(stateList);
        selectedState.current = stateList.find(
          (s) => s.label === data.state.name
        );

        let selectedDistrictLocal;
        if (selectedState.current) {
          const districtRes = await apiClient.get(
            `${DISTRICT_URL}?state_id=${selectedState.current.value}`
          );
          const sortedDistricts = districtRes.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          const districtList = sortedDistricts.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setDistrictItems(districtList);
          selectedDistrict.current = districtList.find(
            (d) => d.label === data.district.name
          );
          selectedDistrictLocal = selectedDistrict.current;
        }

        if (selectedDistrictLocal) {
          const talukaRes = await apiClient.get(
            `${TALUKA_URL}?district_id=${selectedDistrictLocal.value}`
          );
          const sortedTalukas = talukaRes.data.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          const talukaList = sortedTalukas.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setTalukaItems(talukaList);
          selectedTaluka.current = talukaList.find(
            (t) => t.label === data.taluka.name
          );
        }

        setFormState({
          state: selectedState.current?.value || null,
          district: selectedDistrict.current?.value || null,
          taluka: selectedTaluka.current?.value || null,
        });
      } catch (error) {
        console.error("Dealer fetch failed:", error);
        Alert.alert("Error", "Failed to fetch dealer details");
      } finally {
        setLoading(false);
      }
    };
    fetchDealer();
  }, [dealerId]);

  useEffect(() => {
    if (formState.state) {
      apiClient
        .get(`${DISTRICT_URL}?state_id=${formState.state}`)
        .then((res) => {
          const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
          const districtList = sorted.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setDistrictItems(districtList);
          selectedState.current = stateItems.find(
            (s) => s.value === formState.state
          );
        });
    }
  }, [formState.state]);

  useEffect(() => {
    if (formState.district) {
      apiClient
        .get(`${TALUKA_URL}?district_id=${formState.district}`)
        .then((res) => {
          const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
          const talukaList = sorted.map((item) => ({
            label: item.name,
            value: item.id,
          }));
          setTalukaItems(talukaList);
          selectedDistrict.current = districtItems.find(
            (d) => d.value === formState.district
          );
        });
    }
  }, [formState.district]);

  const handleUpdate = async (values) => {
    console.log("Starting the Submitting the data");
    
    try {
      const payload = {
        id: parseInt(dealerId),
        shop_name: values.shopeName,
        owner_name: values.ownerName,
        phone: values.mobile,
        gst_number: values.gstno || "",
        billing_address: location,
        shipping_address: location,
        state: {
          id: formState.state,
          name: selectedState.current?.label || "",
        },
        district: {
          id: formState.district,
          name: selectedDistrict.current?.label || "",
        },
        taluka: {
          id: formState.taluka,
          name: selectedTaluka.current?.label || "",
        },
        agreement_status: values.agreement_status || "active",
        remark: values.remark,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      };

      const response = await apiClient.put(`dealer/${dealerId}/`, payload);

      if (response.status >= 200 && response.status < 300) {
        Alert.alert("Success", "Dealer updated successfully", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert("Error", "Failed to update dealer. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while updating dealer.");
      return;
    }
  };

  if (loading || !dealer)
    return (
      <ActivityIndicator
        size="large"
        color={DESIGN.colors.primary}
        style={{ marginTop: DESIGN.spacing.lg }}
      />
    );

  return (
<View style={{ flex: 1, paddingBottom: insets.bottom }}>
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.heading}>Update Dealer</Text>

      <View style={styles.container}>
        <Formik
          initialValues={{
            shopeName: dealer.shop_name || "",
            ownerName: dealer.owner_name || "",
            mobile: dealer.phone || "",
            gstno: dealer.gst_number || "",
            location: location || "",
            remark: dealer.remark || "",
            agreement_status: dealer.agreement_status || "",
          }}
          validationSchema={dealerSchema}
          onSubmit={handleUpdate}
        >
          {({
            handleChange,
            handleBlur,
            touched,
            errors,
            values,
            handleSubmit,
            setFieldValue,
          }) => (
            <>
              {/* Shop Name */}
              <TextInput
                style={styles.input}
                placeholder="Shop Name *"
                placeholderTextColor={DESIGN.colors.textTertiary}
                onChangeText={handleChange("shopeName")}
                onBlur={handleBlur("shopeName")}
                value={values.shopeName}
              />
              {touched.shopeName && errors.shopeName && (
                <Text style={styles.error}>{errors.shopeName}</Text>
              )}

              {/* Owner Name */}
              <TextInput
                style={styles.input}
                placeholder="Owner Name *"
                placeholderTextColor={DESIGN.colors.textTertiary}
                onChangeText={handleChange("ownerName")}
                onBlur={handleBlur("ownerName")}
                value={values.ownerName}
              />

              {/* Mobile */}
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: DESIGN.colors.surfaceElevated },
                ]}
                placeholder="Mobile *"
                placeholderTextColor={DESIGN.colors.textTertiary}
                keyboardType="number-pad"
                onChangeText={handleChange("mobile")}
                onBlur={handleBlur("mobile")}
                value={values.mobile}
                editable={false}
              />

              {/* GST */}
              <TextInput
                style={styles.input}
                placeholder="GST No"
                placeholderTextColor={DESIGN.colors.textTertiary}
                onChangeText={handleChange("gstno")}
                onBlur={handleBlur("gstno")}
                value={values.gstno}
              />

              {/* Location */}
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: DESIGN.colors.surfaceElevated },
                ]}
                placeholder="Auto Location"
                placeholderTextColor={DESIGN.colors.textTertiary}
                value={location}
                editable={false}
                multiline
              />

              {/* STATE Dropdown */}
              <View>
                <DropDownPicker
                  open={dropdowns.state}
                  setOpen={(open) =>
                    setDropdowns({ ...dropdowns, state: open })
                  }
                  value={formState.state}
                  setValue={(cb) =>
                    setFormState((prev) => ({
                      ...prev,
                      state: cb(prev.state),
                    }))
                  }
                  items={stateItems}
                  placeholder="Select State"
                  style={styles.dropdown}
                  dropDownContainerStyle={{ maxHeight: 200 }}
                  listMode="SCROLLVIEW"
                  searchable={true}
                  searchPlaceholder="Search state..."
                  zIndex={1000}
                />
              </View>

              {/* DISTRICT Dropdown */}
              <View>
                <DropDownPicker
                  open={dropdowns.district}
                  setOpen={(open) =>
                    setDropdowns({ ...dropdowns, district: open })
                  }
                  value={formState.district}
                  setValue={(cb) =>
                    setFormState((prev) => ({
                      ...prev,
                      district: cb(prev.district),
                    }))
                  }
                  items={districtItems}
                  placeholder="Select District"
                  style={styles.dropdown}
                  dropDownContainerStyle={{ maxHeight: 200 }}
                  listMode="SCROLLVIEW"
                  searchable={true}
                  searchPlaceholder="Search district..."
                  zIndex={900}
                />
              </View>

              {/* TALUKA Dropdown */}
              <View>
                <DropDownPicker
                  open={dropdowns.taluka}
                  setOpen={(open) =>
                    setDropdowns({ ...dropdowns, taluka: open })
                  }
                  value={formState.taluka}
                  setValue={(cb) =>
                    setFormState((prev) => ({
                      ...prev,
                      taluka: cb(prev.taluka),
                    }))
                  }
                  items={talukaItems}
                  placeholder="Select Taluka"
                  style={styles.dropdown}
                  dropDownContainerStyle={{ maxHeight: 200 }}
                  listMode="SCROLLVIEW"
                  searchable={true}
                  searchPlaceholder="Search taluka..."
                  zIndex={800}
                />
              </View>

              {/* AGREEMENT Dropdown */}
              <View style={{ zIndex: 700 }}>
                <DropDownPicker
                  open={dropdowns.agreement}
                  setOpen={(open) =>
                    setDropdowns({ ...dropdowns, agreement: open })
                  }
                  value={values.agreement_status}
                  setValue={(cb) =>
                    setFieldValue(
                      "agreement_status",
                      cb(values.agreement_status)
                    )
                  }
                  items={[
                    { label: "Active", value: "active" },
                    { label: "Inactive", value: "inactive" },
                  ]}
                  placeholder="Agreement Status"
                  style={styles.dropdown}
                  dropDownContainerStyle={{ maxHeight: 200 }}
                  listMode="SCROLLVIEW"
                />
              </View>

              {/* Remark */}
              <TextInput
                style={styles.input}
                placeholder="Remark *"
                placeholderTextColor={DESIGN.colors.textTertiary}
                onChangeText={handleChange("remark")}
                onBlur={handleBlur("remark")}
                value={values.remark}
              />
              {touched.remark && errors.remark && (
                <Text style={styles.error}>{errors.remark}</Text>
              )}

              {/* Update Button */}
              <View style={styles.updateButton}>
                <AppButton title="Update Dealer" onPress={handleSubmit} />
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
</View>

);

};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: DESIGN.spacing.sm,
  },
  container: {
    padding: DESIGN.spacing.md,
    backgroundColor: DESIGN.colors.background,
  },
  heading: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.primary,
    textAlign: "center",
    marginBottom: DESIGN.spacing.md,
    marginTop:DESIGN.spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: DESIGN.colors.textTertiary,
    padding: DESIGN.spacing.sm,
    marginVertical: DESIGN.spacing.xs,
    borderRadius: DESIGN.borderRadius.md,
    backgroundColor: DESIGN.colors.surface,
    color: DESIGN.colors.textPrimary,
    ...DESIGN.typography.body,
    ...DESIGN.shadows.subtle,
  },
  dropdown: {
    marginVertical: DESIGN.spacing.xs,
    borderRadius: DESIGN.borderRadius.md,
    borderColor: DESIGN.colors.textTertiary,
    ...DESIGN.shadows.subtle,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: DESIGN.spacing.xs,
  },
  updateButton: {
    paddingTop: DESIGN.spacing.md,
  },
});

export default DealerUpdateScreen;
