import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import userApi from "../src/api/user"
import { AppForm, AppFormField, SubmitButton } from "../src/components/form/appComponents";
import { useNavigation } from "@react-navigation/native";

import { registerSchema } from "../src/validations/registerSchema";
 
function RegisterScreen() {
  const navigation = useNavigation();
  const handleRegister = async (values, { resetForm }) => {
    try {
      const response = await userApi.register({
        username: values.userName.trim(),
        email: values.email.trim(),
        password: values.password,
      });

      if (response.data?.status === true) {
        Alert.alert("✅ Success", "Registered successfully!");
        resetForm();
        navigation.navigate("Login");
      } else {
        Alert.alert(
          "🚫 Registration Failed",
          response.data?.message || "Unexpected error"
        );
      }
    } catch (error) {
      console.error("❌ Registration error:", error);
      Alert.alert("❌ Error", "Check your input and try again.");
    }
  };

  return (
   

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            {/* <Image
              source={require("../assets/ashwamedh-icon.png")}
              style={styles.logo}
            /> */}
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>
              Register to access your dashboard
            </Text>
          </View>

          <AppForm
            initialValues={{ userName: "", email: "", password: "" }}
            onSubmit={handleRegister}
            validationSchema={registerSchema}
          >
            <AppFormField
              name="userName"
              icon="account"
              placeholder="Username"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <AppFormField
              name="email"
              icon="email"
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <AppFormField
              name="password"
              icon="lock"
              placeholder="Password"
              secureTextEntry
            />

            <SubmitButton title="Register" />
          </AppForm>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.footerLink}> Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

   
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f9f9f9",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 80,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    borderRadius: 20,
    marginBottom: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2E7D32",
  },
  subheading: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#444",
  },
  footerLink: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "600",
  },
});

export default RegisterScreen;
