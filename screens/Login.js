import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import authApi from "../src/api/auth";
import useAuth from "../src/auth/useAuth";
import {
  AppForm,
  AppFormField,
  SubmitButton,
} from "../src/components/form/appComponents";
import { loginSchema } from "../src/validations/loginSchema";
import showToast from "../src/utility/showToast";
import DESIGN from "../src/theme";
import styles from "../src/styles/login.style";

function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { logIn } = useAuth();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const handleSubmit = async ({ username, password }) => {
    setLoading(true);

    try {
      const response = await authApi.login(username, password);

      if (response.status !== 200 || !response.data?.data?.token) {
        showToast.error(
          "Something went wrong. Please try again.",
          "Login Error"
        );
        return;
      }

      const token = response.data.data.token;
      await logIn(token);

      navigation.reset({
        index: 0,
        routes: [{ name: "Main" }],
      });

      showToast.success(
        "You have logged in successfully.",
        "✅ Login Successful!"
      );
    } catch (error) {
      showToast.error("Something went wrong. Please try again.", "Login Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Status bar */}
      <StatusBar
        translucent
        barStyle="light-content"
        backgroundColor={
          Platform.OS === "android" ? DESIGN.colors.primary : "transparent"
        }
      />

      {/* Header */}
      <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AUBIZO</Text>
        </View>
      </View>

      {/* Screen */}
      <View style={styles.screen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Login Card */}
            <View style={[styles.loginCard, DESIGN.shadows.medium]}>
              <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>Welcome Back</Text>
                <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
              </View>

              <AppForm
                initialValues={{ username: "", password: "" }}
                onSubmit={handleSubmit}
                validationSchema={loginSchema}
              >
                <View style={styles.formSection}>
                  {/* Username */}
                  <AppFormField
                    name="username"
                    placeholder="Username"
                    autoCapitalize="none"
                    errorstyle={styles.error}
                  />

                  {/* Password with show/hide toggle */}
                  <AppFormField
                    name="password"
                    placeholder="Password"
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                    errorstyle={styles.error}
                    rightIcon={
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        <MaterialCommunityIcons
                          name={showPassword ? "eye-off" : "eye"}
                          size={22}
                          color="#666"
                        />
                      </TouchableOpacity>
                    }
                  />

                  {/* Submit Button */}
                  <View style={styles.buttonContainer}>
                    {loading ? (
                      <View style={styles.loadingButton}>
                        <ActivityIndicator size="small" color="#FFFFFF" />
                        <Text style={styles.loadingText}>Signing in...</Text>
                      </View>
                    ) : (
                      <SubmitButton
                        title="SIGN IN"
                        style={styles.submitButton}
                        textStyle={styles.submitButtonText}
                      />
                    )}
                  </View>
                </View>
              </AppForm>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
}

export default LoginScreen;
