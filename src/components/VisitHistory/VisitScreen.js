import { MaterialCommunityIcons } from "@expo/vector-icons";
import moment from "moment";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DESIGN from "../../theme";
import useVisitHistory from "./useVisitHistory";
import VisitTable from "./VisitTable";
import VisitForm from "./VisitTemplate";

const VisitScreen = ({ location_id, storageKey, navigateTo }) => {
  const visitHistory = useVisitHistory(location_id);
  console.log("Visit History:", visitHistory);

  const currentDate = moment().format("DD-MMM-YYYY");
  const dayName = moment().format("dddd");
  const insets = useSafeAreaInsets();

  const renderHeader = () => (
    <>
      {/* Date & Time Card */}
      <View style={modernStyles.dateTimeCard}>
        <View style={modernStyles.dateTimeContent}>
          <View style={modernStyles.dateSection}>
            <MaterialCommunityIcons
              name="calendar-today"
              size={24}
              color={DESIGN.colors.primary}
            />
            <View style={modernStyles.dateInfo}>
              <Text style={modernStyles.dateText}>{currentDate}</Text>
              <Text style={modernStyles.dayText}>{dayName}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Visit Form Section */}
      <VisitForm storageKey={storageKey} navigateTo={navigateTo} />
    </>
  );

  return (

      <KeyboardAvoidingView
        style={[modernStyles.container,{ paddingBottom: insets.bottom }]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header Section */}
        <View style={modernStyles.header}>
          <View style={modernStyles.headerContent}>
            <View style={modernStyles.headerIcon}>
              <MaterialCommunityIcons
                name="clipboard-check"
                size={32}
                color={DESIGN.colors.primary}
              />
            </View>
            <View style={modernStyles.headerText}>
              <Text style={modernStyles.headerTitle}>Visit Management</Text>
              <Text style={modernStyles.headerSubtitle}>
                Complete your visit and view history
              </Text>
            </View>
          </View>
        </View>

        {/* FlatList Wrapper */}
        <FlatList
          data={[]} // FlatList just wraps static components here
          keyExtractor={(_item, index) => index.toString()}
          ListHeaderComponent={renderHeader}
          ListFooterComponent={<VisitTable data={visitHistory} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={modernStyles.scrollContent}
        />
      </KeyboardAvoidingView>
   
  );
};

const modernStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: DESIGN.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.background,
  },
  header: {
    backgroundColor: DESIGN.colors.surface,
    paddingHorizontal: DESIGN.spacing.lg,
    paddingVertical: DESIGN.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: DESIGN.colors.border,
    ...DESIGN.shadows.subtle,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: DESIGN.colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: DESIGN.spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    ...DESIGN.typography.subtitle,
    color: DESIGN.colors.textPrimary,
    marginBottom: DESIGN.spacing.xs,
  },
  headerSubtitle: {
    ...DESIGN.typography.caption,
    color: DESIGN.colors.textSecondary,
    lineHeight: 18,
  },
  dateTimeCard: {
    backgroundColor: DESIGN.colors.surface,
    marginHorizontal: DESIGN.spacing.md,
    borderRadius: DESIGN.borderRadius.sm,
    ...DESIGN.shadows.medium,
    overflow: "hidden",
  },
  dateTimeContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: DESIGN.spacing.sm,
  },
  dateSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateInfo: {
    marginLeft: DESIGN.spacing.md,
  },
  dateText: {
    ...DESIGN.typography.subheading,
    color: DESIGN.colors.textPrimary,
    marginBottom: DESIGN.spacing.xs,
  },
  dayText: {
    ...DESIGN.typography.caption,
    color: DESIGN.colors.textSecondary,
  },
  scrollContent: {
    paddingBottom: DESIGN.spacing.xl,
    marginTop: DESIGN.spacing.md,
  },
});

export default VisitScreen;
