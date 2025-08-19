import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import * as Yup from "yup";
import apiClient from "../../api/client";
import { navigation } from "../../../navigation/NavigationService";
import storage from "../../utility/storage";
import AppForm from "../form/appComponents/AppForm";
import SubmitButton from "../form/appComponents/SubmitButton";
import InputFormField from "../form/appComponents/InputFormText";
import DESIGN from "../../theme";
import { useState } from "react";

const validationSchema = Yup.object().shape({
  remark: Yup.string().required("Remark is required"),
});

const VisitForm = ({ storageKey, navigateTo }) => {


  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    try {
      setLoading(true);
      const visitId = await storage.get(storageKey);
      if (!visitId) {
        Alert.alert("Error", "Visit ID not found.");
        return;
      }

      const payload = { remark: values.remark };
      const response = await apiClient.patch(
        `track/end-visit/${visitId}/`,
        payload
      );

      if (response.status === 200 || response.status === 204) {
        resetForm();
        await storage.remove(storageKey);
        await storage.remove(storageKey.replace("VISIT", "START"));
        Alert.alert("Success", "Visit ended successfully.");
        navigation.navigate(navigateTo);
      } else {
        Alert.alert("Error", "Failed to end visit.");
      }
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={modernStyles.container}>
      <View style={modernStyles.formContainer}>
        <AppForm
          initialValues={{ remark: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <View style={modernStyles.inputSection}>
            <Text style={modernStyles.inputLabel}>{"Visit Remarks"}</Text>

            <InputFormField
              name="remark"
              placeholder="Enter your remarks about this visit..."
              multiline
              numberOfLines={4}
              style={modernStyles.remarkInput}
            />
          </View>

          <View style={modernStyles.submitSection}>
            <TouchableOpacity
              style={modernStyles.submitButton}
              onPress={() => { }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={DESIGN.colors.surface} size="small" />
              ) : (

                <Text style={modernStyles.submitButtonText}>
                  {"Complete Visit"}
                </Text>

              )}
            </TouchableOpacity>

            {/* Hidden SubmitButton for Formik submission */}
            <View style={modernStyles.hiddenSubmit}>
              <SubmitButton title="Submit" style={modernStyles.xhiddenButton} />
            </View>
          </View>
        </AppForm>
      </View>
    </View>
  );
};

const modernStyles = StyleSheet.create({
  container: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.borderRadius.sm,
    marginHorizontal: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.sm,
    marginTop: DESIGN.spacing.md,
    ...DESIGN.shadows.medium,
    overflow: "hidden",
  },

  header: {
    backgroundColor: DESIGN.colors.accent,
    padding: DESIGN.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.borderLight,
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: DESIGN.spacing.sm,
  },

  headerTitle: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.textPrimary,
    marginLeft: DESIGN.spacing.sm,
  },

  headerSubtitle: {
    ...DESIGN.typography.body,
    color: DESIGN.colors.textSecondary,
    lineHeight: 18,
  },

  formContainer: {
    padding: DESIGN.spacing.lg,
  },

  inputSection: {
    marginBottom: DESIGN.spacing.sm,
  },

  inputLabel: {
    ...DESIGN.typography.subtitle,
    color: DESIGN.colors.textPrimary,
    marginBottom: DESIGN.spacing.md,
  },

  remarkInput: {
    minHeight: 70,
    textAlignVertical: "top",
    backgroundColor: DESIGN.colors.background,
    borderColor: DESIGN.colors.border,
    padding: DESIGN.spacing.md,
  },

  submitButton: {
    backgroundColor: DESIGN.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: DESIGN.spacing.md,
    borderRadius: DESIGN.borderRadius.md,
    ...DESIGN.shadows.subtle,
  },

  submitButtonText: {
    ...DESIGN.typography.subtitle,
    color: DESIGN.colors.surface,
    marginLeft: DESIGN.spacing.sm,
  },

  hiddenSubmit: {
    position: "absolute",
    opacity: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  hiddenButton: {
    backgroundColor: "transparent",
    height: "100%",
  },
});

export default VisitForm;
