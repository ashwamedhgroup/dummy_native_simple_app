import { StyleSheet,Platform} from "react-native";
import DESIGN from "../theme";
export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: DESIGN.colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
  },
   headerContainer: {
    backgroundColor: DESIGN.colors.primary,
    ...DESIGN.shadows.subtle,
  },
  headerContent: {
    height: Platform.OS === 'ios' ? 70 : 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: DESIGN.spacing.lg,
   
  },
  headerTitle: {
    ...DESIGN.typography.title,
    color: DESIGN.colors.surface,
  },
  loginCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.borderRadius.xl,
    paddingVertical: DESIGN.spacing.md,
    paddingHorizontal: DESIGN.spacing.lg,
    alignItems: "center",
    width: "100%",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: DESIGN.spacing.lg,
  },
  welcomeTitle: {
    ...DESIGN.typography.hero,
    color: DESIGN.colors.textPrimary,
    marginBottom: DESIGN.spacing.xs,
    textAlign: "center",
  },
  welcomeSubtitle: {
    ...DESIGN.typography.body,
    color: DESIGN.colors.textSecondary,
    textAlign: "center",
  },
  error: {
    marginRight:12,
    fontSize: 12,
    color: "#d32f2f",
    marginTop: DESIGN.spacing.xs,
    fontWeight: "500",
  },
  formSection: {
    width: "100%",
  },
  optionsRow: {
    alignItems: "flex-end",
    marginBottom: DESIGN.spacing.sm,
    width: "100%",
  },
  forgotText: {
    fontSize: 14,
    color: DESIGN.colors.primary,
    fontWeight: "600",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: DESIGN.spacing.lg,
  },
  loadingButton: {
    backgroundColor: DESIGN.colors.primary,
    borderRadius: DESIGN.borderRadius.lg,
    height: 52,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...DESIGN.shadows.medium,
  },
  loadingText: {
    color: DESIGN.colors.surface,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: DESIGN.spacing.sm,
  },
  submitButton: {
    backgroundColor: DESIGN.colors.primary,
    borderRadius: DESIGN.borderRadius.lg,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    ...DESIGN.shadows.medium,
  },
  submitButtonText: {
    color: DESIGN.colors.surface,
    fontSize: 16,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: DESIGN.colors.textSecondary,
    fontWeight: "400",
  },
  createAccountText: {
    fontSize: 14,
    color: DESIGN.colors.primary,
    fontWeight: "600",
  },
});