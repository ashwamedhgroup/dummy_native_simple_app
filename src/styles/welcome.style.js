import { StyleSheet,Platform } from 'react-native';
import DESIGN from '../theme';
export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DESIGN.colors.background,
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
    },

    imageContainer: {
        position: 'relative',
        height: Platform.select({ ios: 280, android: 260, default: 240 }),
        backgroundColor: DESIGN.colors.surfaceElevated,
    },

    heroImage: {
        width: '100%',
        height: '100%',
    },

    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
    },

    heroSection: {
        paddingHorizontal: DESIGN.spacing.lg,
        paddingVertical: DESIGN.spacing.xl,
        backgroundColor: DESIGN.colors.surface,
        marginBottom: DESIGN.spacing.md,
        ...DESIGN.shadows.subtle,
    },

    heroTitle: {
        ...DESIGN.typography.hero,
        color: DESIGN.colors.textPrimary,
        textAlign: 'center',
        marginBottom: DESIGN.spacing.sm,
    },

    heroSubtitle: {
        ...DESIGN.typography.subtitle,
        color: DESIGN.colors.primary,
        textAlign: 'center',
    },

    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: DESIGN.colors.surface,
        marginHorizontal: DESIGN.spacing.lg,
        marginBottom: DESIGN.spacing.lg,
        paddingVertical: DESIGN.spacing.lg,
        borderRadius: DESIGN.borderRadius.lg,
        ...DESIGN.shadows.medium,
    },

    statItem: {
        alignItems: 'center',
        flex: 1,
    },

    statNumber: {
        ...DESIGN.typography.title,
        color: DESIGN.colors.primary,
        marginBottom: DESIGN.spacing.xs,
    },

    statLabel: {
        ...DESIGN.typography.body,
        color: DESIGN.colors.textSecondary,
        textAlign: 'center',
        fontSize: 14,
    },

    contentSection: {
        paddingHorizontal: DESIGN.spacing.lg,
        justifyContent: 'center',
    },

    contentCard: {
        backgroundColor: DESIGN.colors.surface,
        borderRadius: DESIGN.borderRadius.lg,
        padding: DESIGN.spacing.lg,
        marginBottom: DESIGN.spacing.lg,
        ...DESIGN.shadows.subtle,
    },

    highlightedCard: {
        backgroundColor: DESIGN.colors.primary,
        ...DESIGN.shadows.medium,
    },

    cardTitle: {
        ...DESIGN.typography.subtitle,
        color: DESIGN.colors.textPrimary,
        marginBottom: DESIGN.spacing.md,
    },

    highlightedTitle: {
        color: DESIGN.colors.surface,
    },

    cardText: {
        ...DESIGN.typography.bodyLarge,
        color: DESIGN.colors.textPrimary,
        textAlign: 'justify',
        lineHeight: 28,
    },

    highlightedText: {
        color: DESIGN.colors.surface,
        textAlign: 'center',
        fontWeight: Platform.select({
            ios: '500',
            android: 'normal',
            default: '500',
        }),
    },
});