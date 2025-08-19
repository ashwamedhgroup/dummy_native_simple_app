import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "../src/styles/social.style";
import DESIGN from "../src/theme/index";

const SOCIAL_PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    icon: "youtube",
    color: DESIGN.colors.youtube,
    url: "https://youtube.com/@ashwamedhagri?si=oeR18DKnYA_lC48a",
    description: "Watch our latest videos and tutorials",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    color: DESIGN.colors.facebook,
    url: "https://m.facebook.com/ashwamedhgroup/",
    description: "Follow us for daily updates",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "instagram",
    color: DESIGN.colors.instagram,
    url: "https://www.instagram.com/ashwamedhgroup/",
    description: "See our latest photos and stories",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    color: DESIGN.colors.linkedin,
    url: "https://www.linkedin.com/in/dr-dnyaneshwar-waghchoure-10413962",
    description: "Connect with us professionally",
  },
  {
    id: "twitter",
    name: "Twitter",
    icon: "twitter",
    color: DESIGN.colors.twitter,
    url: "https://www.twitter.com",
    description: "Get real-time updates",
  },
];

const SocialItem = ({ platform, onPress, onShare }) => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <View style={[styles.socialItemContainer, pressed && styles.pressedItem]}>
      <TouchableOpacity
        style={styles.socialItem}
        onPress={() => onPress(platform)}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        activeOpacity={0.85}
        accessible={true}
        accessibilityLabel={`Open ${platform.name}`}
        accessibilityRole="button"
      >
        <View style={[styles.iconContainer, { backgroundColor: `${platform.color}15` }]}>
          <MaterialCommunityIcons name={platform.icon} size={32} color={platform.color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.socialName}>{platform.name}</Text>
          {/* optional: show description under name if needed */}
          {/* <Text style={styles.socialDescription}>{platform.description}</Text> */}
        </View>

        <TouchableOpacity
          style={styles.shareButton}
          onPress={() => onShare(platform)}
          accessible={true}
          accessibilityLabel={`Share ${platform.name}`}
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="share-variant"
            size={20}
            color={DESIGN.colors.textSecondary}
          />
        </TouchableOpacity>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={DESIGN.colors.textTertiary}
        />
      </TouchableOpacity>
    </View>
  );
};

// Header Component
const Header = () => (
  <View style={styles.headerContainer}>
    <Text style={styles.title}>Connect With Us</Text>
    <Text style={styles.subtitle}>
      Join our agricultural community and stay updated with latest farming insights
    </Text>
  </View>
);

const ProfessionalAssistanceCard = () => {
  const handleCallExpert = () => {
    const phoneNumber = "tel:+1234567890"; // replace with actual
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber);
        } else {
          Alert.alert("Error", "Phone calls are not supported on this device");
        }
      })
      .catch((err) => console.error("Error opening phone dialer:", err));
  };

  const handleSendEmail = () => {
    const email = "mailto:support@ashwamedh.com?subject=Agricultural Support Request"; // replace
    Linking.canOpenURL(email)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(email);
        } else {
          Alert.alert("Error", "Email is not supported on this device");
        }
      })
      .catch((err) => console.error("Error opening email:", err));
  };

  return (
    <View style={styles.assistanceCard}>
      <View style={styles.assistanceHeader}>
        <View style={styles.assistanceHeaderText}>
          <Text style={styles.assistanceTitle}>Need Professional Assistance?</Text>
          <Text style={styles.assistanceSubtitle}>
            Our experts are here to help - get personalised agricultural advice, product
            recommendations and technical support from our team
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.assistanceButton, styles.callButton]}
        onPress={handleCallExpert}
        accessible={true}
        accessibilityLabel="Call Expert"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="phone" size={20} color={DESIGN.colors.surface} />
        <Text style={styles.callButtonText}>Call Expert</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.assistanceButton, styles.emailButton]}
        onPress={handleSendEmail}
        accessible={true}
        accessibilityLabel="Send Email"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons name="email-outline" size={20} color={DESIGN.colors.surface} />
        <Text style={styles.emailButtonText}>Send Email</Text>
      </TouchableOpacity>
    </View>
  );
};

function SocialScreen() {
    const insets = useSafeAreaInsets();
  const handleSocialPress = async (platform) => {
    try {
      const supported = await Linking.canOpenURL(platform.url);

      if (supported) {
        await Linking.openURL(platform.url);
      } else {
        Alert.alert(
          "Unable to Open",
          `Cannot open ${platform.name}. Please check if the app is installed or open the link in browser.`,
          [{ text: "OK", style: "default" }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong while trying to open the link.", [
        { text: "OK", style: "default" },
      ]);
    }
  };

  const handleShare = async (platform) => {
    try {
      const message = `${platform.name}\n${platform.description}\n${platform.url}`;
      await Share.share(
        {
          message,
          url: platform.url,
          title: platform.name,
        },
        {
          // Android dialog title
          dialogTitle: `Share ${platform.name}`,
        }
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong while sharing.");
    }
  };

  return (
    <View style={{flex:1,paddingBottom: insets.bottom}}>
    <ScrollView
      style={[styles.scrollView]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      bounces={Platform.OS === "ios"}
    >
      <Header />

      <View style={styles.socialContainer}>
        {SOCIAL_PLATFORMS.map((platform) => (
          <SocialItem
            key={platform.id}
            platform={platform}
            onPress={handleSocialPress}
            onShare={handleShare}
          />
        ))}
      </View>

      <ProfessionalAssistanceCard />
    </ScrollView>
    </View>
  );
}

export default SocialScreen;
