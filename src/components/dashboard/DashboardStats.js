import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import DESIGN from "../../theme";

const { width } = Dimensions.get('window');

const DashboardStats = ({ dashboardData }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [dashboardData]);

  if (!dashboardData) return null;

  const { punch_status, visit_summary, working_hours, user_name, date } = dashboardData;

  const formatTime = (time) => {
    if (!time) return '--:--';
    return time.substring(0, 5); // Format HH:MM
  };

  const formatHours = (hours) => {
    if (hours === 0 || hours === null || hours === undefined) return '0.0';
    return hours.toFixed(1);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Today';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (punched) => {
    return punched ? DESIGN.colors.success : DESIGN.colors.textSecondary;
  };

  const AnimatedCard = ({ children, delay = 0 }) => {
    const cardFade = useRef(new Animated.Value(0)).current;
    const cardSlide = useRef(new Animated.Value(20)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 600,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 500,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: cardFade,
          transform: [{ translateY: cardSlide }],
        }}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* Welcome Header */}
      <AnimatedCard delay={100}>
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons 
                name="account-circle" 
                size={40} 
                color={DESIGN.colors.primary} 
              />
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeTitle}>Welcome back!</Text>
              <Text style={styles.userName}>{user_name || 'Employee'}</Text>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {/* Quick Stats Overview */}
      <AnimatedCard delay={200}>
        <View style={styles.quickStatsContainer}>
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: punch_status?.punched_in ? DESIGN.colors.success + '20' : DESIGN.colors.error + '20' }]}>
              <Ionicons 
                name={punch_status?.punched_in ? "checkmark-circle" : "time-outline"} 
                size={24} 
                color={punch_status?.punched_in ? DESIGN.colors.success : DESIGN.colors.error} 
              />
            </View>
            <Text style={styles.quickStatLabel}>Status</Text>
            <Text style={[styles.quickStatValue, { color: punch_status?.punched_in ? DESIGN.colors.success : DESIGN.colors.error }]}>
              {punch_status?.punched_in ? (punch_status?.punched_out ? 'Complete' : 'Active') : 'Inactive'}
            </Text>
          </View>
          
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: DESIGN.colors.primary + '20' }]}>
              <MaterialCommunityIcons name="clock-outline" size={24} color={DESIGN.colors.primary} />
            </View>
            <Text style={styles.quickStatLabel}>Hours</Text>
            <Text style={[styles.quickStatValue, { color: DESIGN.colors.primary }]}>
              {formatHours(working_hours)}h
            </Text>
          </View>
          
          <View style={styles.quickStatItem}>
            <View style={[styles.quickStatIcon, { backgroundColor: DESIGN.colors.accent + '20' }]}>
              <MaterialCommunityIcons name="account-group" size={24} color={DESIGN.colors.accent} />
            </View>
            <Text style={styles.quickStatLabel}>Visits</Text>
            <Text style={[styles.quickStatValue, { color: DESIGN.colors.accent }]}>
              {visit_summary?.total_visits || 0}
            </Text>
          </View>
        </View>
      </AnimatedCard>

      {/* Detailed Punch Status Card */}
      <AnimatedCard delay={300}>
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIcon, { backgroundColor: DESIGN.colors.primary + '15' }]}>
                <MaterialCommunityIcons name="clock-check" size={22} color={DESIGN.colors.primary} />
              </View>
              <Text style={styles.cardTitle}>Attendance Details</Text>
            </View>
          </View>
          
          <View style={styles.punchDetailContainer}>
            <View style={styles.punchDetailRow}>
              <View style={styles.punchDetailItem}>
                <View style={styles.punchIconContainer}>
                  <MaterialCommunityIcons 
                    name="login" 
                    size={20} 
                    color={getStatusColor(punch_status?.punched_in)} 
                  />
                </View>
                <View style={styles.punchTextContainer}>
                  <Text style={styles.punchDetailLabel}>Punch In</Text>
                  <Text style={[
                    styles.punchDetailTime, 
                    { color: getStatusColor(punch_status?.punched_in) }
                  ]}>
                    {punch_status?.punched_in ? formatTime(punch_status.punch_in_time) : 'Not punched'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.punchDetailItem}>
                <View style={styles.punchIconContainer}>
                  <MaterialCommunityIcons 
                    name="logout" 
                    size={20} 
                    color={getStatusColor(punch_status?.punched_out)} 
                  />
                </View>
                <View style={styles.punchTextContainer}>
                  <Text style={styles.punchDetailLabel}>Punch Out</Text>
                  <Text style={[
                    styles.punchDetailTime, 
                    { color: getStatusColor(punch_status?.punched_out) }
                  ]}>
                    {punch_status?.punched_out ? formatTime(punch_status.punch_out_time) : 'Not punched'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.workingHoursContainer}>
              <View style={styles.workingHoursIcon}>
                <MaterialCommunityIcons name="timer" size={18} color={DESIGN.colors.primary} />
              </View>
              <Text style={styles.workingHoursLabel}>Total Working Hours: </Text>
              <Text style={styles.workingHoursValue}>{formatHours(working_hours)} hours</Text>
            </View>
          </View>
        </View>
      </AnimatedCard>

      {/* Visit Statistics Card */}
      <AnimatedCard delay={400}>
        <View style={styles.detailCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <View style={[styles.cardIcon, { backgroundColor: DESIGN.colors.accent + '15' }]}>
                <MaterialCommunityIcons name="chart-bar" size={22} color={DESIGN.colors.accent} />
              </View>
              <Text style={styles.cardTitle}>Today's Performance</Text>
            </View>
          </View>
          
          <View style={styles.performanceGrid}>
            <View style={styles.performanceRow}>
              <View style={[styles.performanceItem, styles.performanceItemLarge]}>
                <View style={[styles.performanceIcon, { backgroundColor: DESIGN.colors.primary + '15' }]}>
                  <MaterialCommunityIcons name="map-marker-multiple" size={28} color={DESIGN.colors.primary} />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceNumber}>{visit_summary?.total_visits || 0}</Text>
                  <Text style={styles.performanceLabel}>Total Visits</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <View style={[styles.performanceIcon, { backgroundColor: DESIGN.colors.success + '15' }]}>
                  <MaterialCommunityIcons name="sprout" size={24} color={DESIGN.colors.success} />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceNumber}>{visit_summary?.farmer_visits || 0}</Text>
                  <Text style={styles.performanceLabel}>Farmers</Text>
                </View>
              </View>
              
              <View style={styles.performanceItem}>
                <View style={[styles.performanceIcon, { backgroundColor: DESIGN.colors.warning + '15' }]}>
                  <MaterialCommunityIcons name="store" size={24} color={DESIGN.colors.warning} />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceNumber}>{visit_summary?.dealer_visits || 0}</Text>
                  <Text style={styles.performanceLabel}>Dealers</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.performanceRow}>
              <View style={styles.performanceItem}>
                <View style={[styles.performanceIcon, { backgroundColor: DESIGN.colors.info + '15' }]}>
                  <MaterialCommunityIcons name="account-heart" size={24} color={DESIGN.colors.info} />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceNumber}>{visit_summary?.unique_farmers_visited || 0}</Text>
                  <Text style={styles.performanceLabel}>Unique Farmers</Text>
                </View>
              </View>
              
              <View style={styles.performanceItem}>
                <View style={[styles.performanceIcon, { backgroundColor: DESIGN.colors.secondary + '15' }]}>
                  <MaterialCommunityIcons name="handshake" size={24} color={DESIGN.colors.secondary} />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceNumber}>{visit_summary?.unique_dealers_visited || 0}</Text>
                  <Text style={styles.performanceLabel}>Unique Dealers</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </AnimatedCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  
  // Welcome Card Styles
  welcomeCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.borderRadius.lg,
    padding: 20,
    marginBottom: 16,
    ...DESIGN.shadows.medium,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DESIGN.colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DESIGN.colors.textPrimary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: DESIGN.colors.textSecondary,
    fontWeight: '500',
  },

  // Quick Stats Styles
  quickStatsContainer: {
    flexDirection: 'row',
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.borderRadius.large,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-between',
    ...DESIGN.shadows.medium,
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickStatLabel: {
    fontSize: 12,
    color: DESIGN.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 4,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Detail Card Styles
  detailCard: {
    backgroundColor: DESIGN.colors.surface,
    borderRadius: DESIGN.borderRadius.large,
    padding: 20,
    marginBottom: 16,
    ...DESIGN.shadows.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DESIGN.colors.textPrimary,
  },

  // Punch Detail Styles
  punchDetailContainer: {
    gap: 16,
  },
  punchDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  punchDetailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN.colors.background,
    padding: 16,
    borderRadius: DESIGN.borderRadius.medium,
  },
  punchIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DESIGN.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...DESIGN.shadows.small,
  },
  punchTextContainer: {
    flex: 1,
  },
  punchDetailLabel: {
    fontSize: 12,
    color: DESIGN.colors.textSecondary,
    fontWeight: '500',
    marginBottom: 2,
  },
  punchDetailTime: {
    fontSize: 16,
    fontWeight: '600',
  },
  workingHoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: DESIGN.colors.primary + '08',
    padding: 16,
    borderRadius: DESIGN.borderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: DESIGN.colors.primary,
  },
  workingHoursIcon: {
    marginRight: 8,
  },
  workingHoursLabel: {
    fontSize: 14,
    color: DESIGN.colors.textSecondary,
    fontWeight: '500',
  },
  workingHoursValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: DESIGN.colors.primary,
  },

  // Performance Grid Styles
  performanceGrid: {
    gap: 12,
  },
  performanceRow: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceItem: {
    flex: 1,
    backgroundColor: DESIGN.colors.background,
    padding: 16,
    borderRadius: DESIGN.borderRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
  },
  performanceItemLarge: {
    backgroundColor: DESIGN.colors.primary + '08',
    borderWidth: 1,
    borderColor: DESIGN.colors.primary + '20',
  },
  performanceIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  performanceContent: {
    flex: 1,
  },
  performanceNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DESIGN.colors.textPrimary,
    marginBottom: 2,
  },
  performanceLabel: {
    fontSize: 12,
    color: DESIGN.colors.textSecondary,
    fontWeight: '500',
  },
});

export default DashboardStats;
