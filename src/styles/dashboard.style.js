import DESIGN from "../theme";

export const styles = {
  container: {
    flex: 1,
    backgroundColor: DESIGN.colors.background,
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: DESIGN.spacing.md,
    paddingVertical: DESIGN.spacing.sm,
    borderRadius: DESIGN.borderRadius.lg,
    marginTop: DESIGN.spacing.md,
    marginBottom: DESIGN.spacing.lg,
    ...DESIGN.shadows.subtle,
  },

  statusBadgeActive: {
    backgroundColor: DESIGN.colors.success + '15',
    borderWidth: 1,
    borderColor: DESIGN.colors.success + '30',
  },

  statusBadgeInactive: {
    backgroundColor: DESIGN.colors.warning + '15',
    borderWidth: 1,
    borderColor: DESIGN.colors.warning + '30',
  },

  statusText: {
    marginLeft: DESIGN.spacing.xs,
    fontSize: DESIGN.typography.body.fontSize,
    fontWeight: "600",
  },

  statusTextActive: {
    color: DESIGN.colors.success,
  },

  statusTextInactive: {
    color: DESIGN.colors.warning,
  },

  mainContent: {
    paddingHorizontal: DESIGN.spacing.md,
    paddingBottom: DESIGN.spacing.xl,
  },

  punchSection: {
    alignItems: "center",
    marginBottom: DESIGN.spacing.xxl,
    paddingVertical: DESIGN.spacing.lg,
  },

  punchButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    ...DESIGN.shadows.medium,
    elevation: 8,
  },

  punchButtonActive: {
    backgroundColor: DESIGN.colors.success,
  },

  punchButtonInactive: {
    backgroundColor: DESIGN.colors.error,
  },

  punchButtonText: {
    color: DESIGN.colors.surface,
    fontSize: DESIGN.typography.subtitle.fontSize,
    fontWeight: "700",
    marginTop: DESIGN.spacing.sm,
    textAlign: "center",
  },

  punchIcon: {
    marginBottom: DESIGN.spacing.xs,
  },

  actionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: DESIGN.spacing.md,
  },

  actionCard: {
    flex: 1,
    backgroundColor: DESIGN.colors.surface,
    paddingVertical: DESIGN.spacing.xl,
    paddingHorizontal: DESIGN.spacing.md,
    borderRadius: DESIGN.borderRadius.lg,
    ...DESIGN.shadows.medium,
    borderWidth: 1,
    borderColor: DESIGN.colors.border,
  },

  actionCardDisabled: {
    backgroundColor: DESIGN.colors.surfaceElevated,
    borderColor: DESIGN.colors.borderLight,
    opacity: 0.6,
  },

  actionIcon: {
    marginBottom: DESIGN.spacing.md,
  },

  actionTitle: {
    fontSize: DESIGN.typography.body.fontSize,
    fontWeight: "600",
    color: DESIGN.colors.textPrimary,
    textAlign: "center",
    lineHeight: 20,
  },

  actionTitleDisabled: {
    color: DESIGN.colors.textSecondary,
  },
};
