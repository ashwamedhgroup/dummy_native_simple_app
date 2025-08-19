import { StyleSheet, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DESIGN from "../../../theme";

function AppInputText({ icon, placeholder, style, iconStyle, rightIcon, ...otherProps }) {
  return (
    <View style={styles.container}>
      {icon && (
        <MaterialCommunityIcons
          name={icon}
          size={24}
          color={DESIGN.colors.iconPrimary}
          style={[styles.icon, iconStyle]}
        />
      )}
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={DESIGN.colors.textSecondary}
        style={[styles.input, style]}
        {...otherProps}
      />
      {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.borderRadius.md,
    alignItems: "center",
    flexDirection: "row",
    marginHorizontal: DESIGN.spacing.sm,
    borderWidth: 1,
    borderColor: DESIGN.colors.textTertiary,
    paddingHorizontal: DESIGN.spacing.sm,
  },
  icon: {
    marginRight: DESIGN.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: DESIGN.colors.textPrimary,
    paddingVertical: 0,
  },
  rightIcon: {
   position: "absolute",
  right: DESIGN.spacing.sm,
 },
});

export default AppInputText;
