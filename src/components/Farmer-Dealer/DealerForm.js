import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import apiClient from "../../api/client";
import { DealerSchema } from "../../validations/DealerSchema";
import useMasterData from "../../hooks/useMasterData";
import DESIGN from "../../theme";
import Location from "../../utility/location";
import AppDropDownPicker from "../form/appComponents/AppDropDownPicker";
import InputFormField from "../form/appComponents/InputFormText";
import OTPModal from "./OTPModal";

function DealerForm({ location, stateDealerForm }) {
  const { states, districts, talukas, loadStates, loadDistricts, loadTalukas } =
    useMasterData();

  const [dropdowns, setDropdowns] = useState({
    state: false,
    district: false,
    taluka: false,
    agreement: false,
  });

  const [formState, setFormState] = useState({
    state: null,
    district: null,
    taluka: null,
    agreement: null,
  });

  // OTP related states
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [createdDealerId, setCreatedDealerId] = useState(null);
  const [creatingDealer, setCreatingDealer] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    // --- Case 1: Dealer already exists → Only update phone & resend OTP ---
    if (createdDealerId) {
      try {
        setCreatingDealer(true);

        // Update dealer phone
        // await apiClient.patch(`dealer/${createdDealerId}/update-phone/`, {
        //   phone: values.phone.trim(),
        // });

        // Resend OTP
        await apiClient.post(`dealer/${createdDealerId}/send-otp/`);
        setOtpModalVisible(true);
      } catch (err) {
        console.error("Error resending OTP:", err.response?.data || err.message);
        Alert.alert("Error", "Failed to resend OTP. Please try again.");
      } finally {
        setCreatingDealer(false);
      }
      return;
    }

    // --- Case 2: First time dealer creation ---
    const { state, district, taluka } = formState;
    let latitude = null;
    let longitude = null;

    try {
      const loc = await Location.getCurrentLocationDetails();
      latitude = loc?.latitude;
      longitude = loc?.longitude;
    } catch (e) {
      console.warn("Couldn't fetch location: ", e?.message || e);
    }

    try {

      const payload = {
        shop_name: values.shop_name.trim(),
        owner_name: values.owner_name.trim(),
        phone: values.phone.trim(),
        gst_number: values.gst_number ? values.gst_number.trim() : "",
        remark: values.remark ? values.remark.trim() : "",
        agreement_status: values.agreement_status,
        billing_address: (location || "").trim(),
        shipping_address: (location || "").trim(),
        state_id: state,
        district_id: district,
        taluka_id: taluka,
        latitude: latitude != null ? Number(latitude?.toFixed(6)) : null,
        longitude: longitude != null ? Number(longitude?.toFixed(6)) : null,
      };

      const response = await apiClient.post(`dealer/create/`, payload);
      const dealerId = response?.data?.id ?? response?.data?.dealer_id ?? null;


      setCreatedDealerId(dealerId);

      try {
        await apiClient.post(`dealer/${dealerId}/send-otp/`);
        setOtpModalVisible(true);
      } catch (sendErr) {
        console.error(
          "Error sending OTP after create:",
          sendErr.response?.data || sendErr.message
        );
        Alert.alert(
          "Error",
          "Failed to send OTP. You can resend OTP."
        );
        setOtpModalVisible(true);
      }
    } catch (error) {
      console.error("Error creating dealer:", error.response?.data || error.message);
      Alert.alert("Error", "Failed to create dealer");
    } finally {
      setCreatingDealer(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <FlatList
        data={[{ key: "form" }]}
        keyExtractor={(id) => id.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={modernStyles.container}
        renderItem={() => (
          <View style={modernStyles.formWrapper}>
            <Formik
              initialValues={{
                shop_name: "",
                owner_name: "",
                phone: "",
                gst_number: "",
                state: "",
                remark: "",
                agreement_status: "active",
              }}
              validationSchema={DealerSchema}
              onSubmit={handleSubmit}
            >
              {({ values, handleSubmit, setFieldValue }) => (
                <View style={modernStyles.formContent}>
                  {/* Business Information */}
                  <View style={modernStyles.section}>
                    <View style={modernStyles.sectionHeader}>
                      <MaterialCommunityIcons
                        name="storefront"
                        size={20}
                        color={DESIGN.colors.primary}
                      />
                      <Text style={modernStyles.sectionTitle}>
                        Business Information
                      </Text>
                    </View>

                    <View style={modernStyles.inputContainer}>
                      <InputFormField name="shop_name" placeholder="Shop Name *" />
                    </View>

                    <View style={modernStyles.inputContainer}>
                      <InputFormField name="owner_name" placeholder="Owner Name *" />
                    </View>

                    <View style={modernStyles.inputContainer}>
                      <InputFormField name="phone" placeholder="Phone *" />
                    </View>

                    <View style={modernStyles.inputContainer}>
                      <InputFormField name="gst_number" placeholder="GST Number" />
                    </View>
                  </View>

                  {/* Location Information */}
                  <View style={modernStyles.section}>
                    <View style={modernStyles.sectionHeader}>
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={20}
                        color={DESIGN.colors.primary}
                      />
                      <Text style={modernStyles.sectionTitle}>
                        Location Information
                      </Text>
                    </View>

                    <View style={modernStyles.inputContainer}>
                      <InputFormField
                        name="location"
                        externalValue={location}
                        placeholder="Fetching current location..."
                        editable={false}
                        multiline
                        style={modernStyles.locationInput}
                        errorstyle={modernStyles.error}
                      />
                    </View>

                    {/* State */}
                    <View style={modernStyles.dropdownContainer}>
                    <AppDropDownPicker
  open={dropdowns.state}
  value={formState.state}
  items={states}
  setOpen={async (open) => {
    setDropdowns((prev) => ({
      ...prev,
      state: open,
      district: false,
      taluka: false,
      agreement: false,
    }));
    if (open && states.length === 0) await loadStates();
  }}
  setValue={(callback) =>
    setFormState((prev) => ({ ...prev, state: callback(prev.state) }))
  }
  placeholder="Select State"
  searchable={true}
  searchablePlaceholder="Search State"   // ✅ now will override "Type something"
  searchableError={() => "State not found"}
  listMode="SCROLLVIEW"
  maxHeight={200}
  zIndex={1000}
  elevation={1000}
/>

                    </View>


                    {/* District */}
                    <View style={modernStyles.dropdownContainer}>
                      <AppDropDownPicker
                        open={dropdowns.district}
                        value={formState.district}
                        items={districts}
                        setOpen={async (open) => {
                          setDropdowns((prev) => ({
                            ...prev,
                            district: open,
                            taluka: false,
                            state: false,
                            agreement: false,
                          }));
                          if (open && formState.state && districts.length === 0) {
                            await loadDistricts(formState.state);
                          }
                        }}
                        setValue={(callback) =>
                          setFormState((prev) => ({ ...prev, district: callback(prev.district) }))
                        }
                        name={formState.district}
                        placeholder="Select District"
                        searchable={true}
                        searchablePlaceholder="Search District"
                        listMode="SCROLLVIEW"
                        maxHeight={200}
                        searchableError={() => "District not found"}
                        zIndex={900}
                        elevation={900}
                      />

                    </View>

                    {/* Taluka */}
                    <View style={[modernStyles.dropdownContainer]}>
                      <AppDropDownPicker
                        open={dropdowns.taluka}
                        value={formState.taluka}
                        items={talukas}
                        setOpen={async (open) => {
                          setDropdowns((prev) => ({
                            ...prev,
                            taluka: open,
                            district: false,
                            state: false,
                            agreement: false,
                          }));
                          if (open && formState.district && talukas.length === 0)
                            await loadTalukas(formState.district);
                        }}
                        setValue={(callback) =>
                          setFormState((prev) => ({ ...prev, taluka: callback(prev.taluka) }))
                        }
                        placeholder="Select Taluka"
                        searchable
                        searchablePlaceholder="Search Taluka"
                        listMode="SCROLLVIEW"
                        nestedScrollEnabled
                        maxHeight={200}
                        searchableError={() => "Taluka not found"}
                        zIndex={800}
                      />
                    </View>
                  </View>

                  {/* Agreement & Additional Information */}
                  <View style={modernStyles.section}>
                    <View style={modernStyles.sectionHeader}>
                      <MaterialCommunityIcons
                        name="file-document"
                        size={20}
                        color={DESIGN.colors.primary}
                      />
                      <Text style={modernStyles.sectionTitle}>
                        Agreement & Additional Information
                      </Text>
                    </View>

                    <View style={modernStyles.dropdownContainer}>
                      <Text style={modernStyles.fieldLabel}>Agreement Status</Text>
                      <AppDropDownPicker
                        open={dropdowns.agreement}
                        value={values.agreement_status}
                        items={[
                          { label: "Active", value: "active" },
                          { label: "Inactive", value: "inactive" },
                        ]}
                        setOpen={(open) =>
                          setDropdowns((prev) => ({
                            ...prev,
                            agreement: open,
                            state: false,
                            district: false,
                            taluka: false,
                          }))
                        }
                        setValue={(callback) =>
                          setFieldValue("agreement_status", callback(values.agreement_status))
                        }
                        placeholder="Agreement Status"
                        zIndex={700}
                      />
                    </View>

                    <View style={modernStyles.inputContainer}>
                      <InputFormField name="remark" placeholder="Remark *" />
                    </View>
                  </View>

                  {/* Submit Button */}
                  <View style={modernStyles.submitContainer}>
                    <TouchableOpacity
                      style={modernStyles.submitButton}
                      onPress={handleSubmit}
                      activeOpacity={0.8}
                      disabled={creatingDealer}
                    >
                      {creatingDealer ? (
                        <ActivityIndicator color={DESIGN.colors.surface} />
                      ) : (
                        <>
                          <Text style={modernStyles.submitButtonText}>
                            {createdDealerId ? "Resend OTP" : "Generate OTP"}
                          </Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Formik>
          </View>
        )}
      />
      <OTPModal
        visible={otpModalVisible}
        dealerId={createdDealerId}
        onClose={() => setOtpModalVisible(false)}
        onVerified={() => {
          setOtpModalVisible(false);
          stateDealerForm(false);
          setCreatedDealerId(null);
        }}
      />
    </KeyboardAvoidingView>
  );
}

const modernStyles = StyleSheet.create({
  container: {
    paddingBottom: 80,
  },
  formWrapper: {
    backgroundColor: DESIGN.colors.surface,
    margin: DESIGN.spacing.lg,
    borderRadius: DESIGN.borderRadius.lg,
    ...DESIGN.shadows.medium,
    overflow: "hidden",
  },
  formContent: {
    padding: DESIGN.spacing.md,
  },
  section: {
    marginBottom: DESIGN.spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: DESIGN.spacing.md,
    paddingBottom: DESIGN.spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: DESIGN.colors.accent,
  },
  sectionTitle: {
    ...DESIGN.typography.subtitle,
    color: DESIGN.colors.textPrimary,
    marginLeft: DESIGN.spacing.sm,
  },
  inputContainer: {
    marginBottom: DESIGN.spacing.md,
  },
  locationInput: {
    backgroundColor: DESIGN.colors.surfaceElevated,
    borderColor: DESIGN.colors.borderLight,
    fontStyle: "italic",
    color: DESIGN.colors.textSecondary,
  },
  dropdownContainer: {
    marginBottom: DESIGN.spacing.sm,
    position: "relative",
  },
  fieldLabel: {
    ...DESIGN.typography.label,
    color: DESIGN.colors.textPrimary,
    marginBottom: DESIGN.spacing.sm,
  },
  disabledBtn: {
    backgroundColor: DESIGN.colors.borderLight,
  },
  submitButton: {
    backgroundColor: DESIGN.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: DESIGN.spacing.md,
    borderRadius: DESIGN.borderRadius.md,
    ...DESIGN.shadows.medium,
  },
  submitButtonText: {
    ...DESIGN.typography.subtitle,
    color: DESIGN.colors.surface,
    marginLeft: DESIGN.spacing.sm,
  },
});

export default DealerForm;
