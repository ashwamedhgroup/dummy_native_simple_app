import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import DESIGN from "../src/theme";
import styles from "../src/styles/contact.style";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ---------------- Contact Card (no animations) ---------------- */
const ContactCard = ({ icon, title, subTitle, iconColor, onPress }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <View style={styles.contactCard}>
      <TouchableOpacity
        style={[
          styles.contactCardContent,
          pressed && styles.pressedCard,
        ]}
        onPress={onPress}
        activeOpacity={0.75}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        accessible
        accessibilityLabel={`${title}: ${subTitle}`}
        accessibilityRole="button"
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${iconColor || DESIGN.colors.primary}15` },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={iconColor || DESIGN.colors.primary}
          />
        </View>

        <View style={styles.contactContent}>
          <Text style={styles.contactTitle} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.contactSubtitle} numberOfLines={4}>
            {subTitle}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          accessibilityLabel="More"
          accessibilityRole="button"
          onPress={onPress}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color={DESIGN.colors.textSecondary}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

/* ---------------- Header ---------------- */
const ContactHeader = () => {
  const blurhash = "LKO2?U%2Tw=w]~RBVZRi};RPxuwH";

  const safeOpen = async (url) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (can) await Linking.openURL(url);
      else throw new Error("Unable to open URL");
    } catch (err) {
      if (url.startsWith("tel:")) {
        Alert.alert("Cannot open phone dialer", "Your device cannot place phone calls.");
      } else if (url.startsWith("mailto:")) {
        Alert.alert("Cannot open mail", "No mail client available.");
      } else {
        const web = "https://maps.google.com/?q=19.892738,74.494128";
        Linking.openURL(web).catch(() =>
          Alert.alert("Unable to open link", "Please try manually.")
        );
      }
    }
  };

  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.headerImage}
        source={require("../assets/images/contact_page.jpg")}
        contentFit="cover"
        placeholder={{ blurhash }}
        transition={500}
      />

      <View style={styles.headerOverlay}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Get In Touch</Text>
          <Text style={styles.headerSubtitle}>
            We're here to help you grow your business
          </Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => safeOpen("tel:+918411887021")}
            accessibilityLabel="Call Ashwamedh"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="phone" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => safeOpen("mailto:ashwamedhagro@gmail.com")}
            accessibilityLabel="Email Ashwamedh"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="email" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() =>
              Linking.openURL("https://maps.google.com/?q=19.892738,74.494128").catch(() =>
                Alert.alert("Cannot open maps", "Please open maps manually.")
              )
            }
            accessibilityLabel="Open location in maps"
            accessibilityRole="button"
          >
            <MaterialCommunityIcons name="map-marker" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ---------------- Map ---------------- */
const ContactMap = () => {
  const openInMaps = async () => {
    const lat = 19.892738;
    const lng = 74.494128;
    const iosUrl = `maps:0,0?q=${lat},${lng}`;
    const androidUrl = `geo:0,0?q=${lat},${lng}`;
    const webUrl = `https://maps.google.com/?q=${lat},${lng}`;

    const url = Platform.OS === "ios" ? iosUrl : androidUrl;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
      else await Linking.openURL(webUrl);
    } catch (err) {
      Alert.alert("Unable to open maps", "Please open maps manually.");
    }
  };

  return (
    <View style={styles.mapSection}>
      <View style={styles.mapHeader}>
        <Text style={styles.mapTitle}>Our Location</Text>
        <TouchableOpacity style={styles.directionsButton} onPress={openInMaps}>
          <MaterialCommunityIcons name="directions" size={18} color={DESIGN.colors.primary} />
          <Text style={styles.directionsText}>Get Directions</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 19.892738,
            longitude: 74.494128,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }}
        >
          <Marker
            coordinate={{ latitude: 19.892738, longitude: 74.494128 }}
            title="Ashwamedh Agro Chemicals Pvt. Ltd."
            description="Gokul Complex, Gokul Nagari, Indirapath, Kopargoan"
          />
        </MapView>

        <TouchableOpacity style={styles.mapOverlayButton} onPress={openInMaps}>
          <MaterialCommunityIcons name="fullscreen" size={20} color={DESIGN.colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------------- Main Screen ---------------- */
export default function ContactScreen() {
  const insets = useSafeAreaInsets();
  const contactData = [
    {
      icon: "map-marker",
      title: "Location",
      subTitle:
        "Ashwamedh Agro Chemicals Pvt. Ltd.,\nGokul Complex, Gokul Nagari, Indirapath,\nKopargoan\nDist: Ahilyanager\nMaharashtra - India - 423 601",
      action: () =>
        Linking.openURL("https://maps.google.com/?q=19.892738,74.494128").catch(() =>
          Alert.alert("Cannot open maps", "Please open maps manually.")
        ),
    },
    {
      icon: "cellphone",
      title: "Mobile No",
      subTitle: "+91 7768004545",
      action: () => {
        Alert.alert("Call", "Choose a number to call:", [
          { text: "Cancel", style: "cancel" },
          {
            text: "+91 7768004545",
            onPress: () =>
              Linking.openURL("tel:+917768004545").catch(() =>
                Alert.alert("Cannot call", "Your device cannot place phone calls.")
              ),
          },
        ]);
      },
    },
    {
      icon: "phone-classic",
      title: "Telephone",
      subTitle: "+91 (02423) 225525",
      action: () =>
        Linking.openURL("tel:+912423225525").catch(() =>
          Alert.alert("Cannot call", "Your device cannot place phone calls.")
        ),
    },
    {
      icon: "email",
      iconColor: "#1B4F72",
      title: "Email",
      subTitle: "info@ashwamedhgroup.com",
      action: () => {
        Alert.alert("Send Email", "Do you want to send an email to info@ashwamedhgroup.com?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () =>
              Linking.openURL("mailto:info@ashwamedhgroup.com").catch(() =>
                Alert.alert("Cannot open mail", "No mail client found.")
              ),
          },
        ]);
      },
    },
  ];

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ContactHeader />
        <View style={styles.contactSection}>
          {contactData.map((c, idx) => (
            <ContactCard key={idx} {...c} />
          ))}
        </View>
        <ContactMap />
      </ScrollView>
    </View>
  );
}
