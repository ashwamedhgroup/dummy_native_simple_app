import {
    Text,
    View,
    ScrollView,
    Platform,
    StyleSheet,
} from 'react-native';
import styles from '../src/styles/welcome.style'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
const CONTENT = {
    hero: {
        title: 'Welcome to Ashwamedh',
        subtitle: 'Organic Agriculture Solutions Since 1999',
    },
    description: `Ashwamedh is an organic center established in 1999. After extensive research and survey of challenges faced by global farmers, we have successfully launched 60 agricultural biotechnology-based products for agriculture. Our unit is recognized as an eco-friendly manufacturer in agriculture inputs, with 25 organic inputs certified by NPOP Indian standards.`,
    mission: {
        title: 'Our Mission',
        text: 'Think globally, work honestly, serve happily',
    },
    vision: {
        title: 'Our Vision',
        text: 'Dedication through Perfection',
    },
    stats: [
        { number: '25+', label: 'Years of Experience' },
        { number: '60+', label: 'Bio-tech Products' },
        { number: '25', label: 'NPOP Certified Products' },
    ],
};

const HeroSection = () => (
    <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>{CONTENT.hero.title}</Text>
        <Text style={styles.heroSubtitle}>{CONTENT.hero.subtitle}</Text>
    </View>
);

const StatsSection = () => (
    <View style={styles.statsContainer}>
        {CONTENT.stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
                <Text style={styles.statNumber}>{stat.number}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
        ))}
    </View>
);

const ContentCard = ({ title, text, isHighlighted = false }) => (
    <View style={[styles.contentCard, isHighlighted && styles.highlightedCard]}>
        {title && (
            <Text
                style={[styles.cardTitle, isHighlighted && styles.highlightedTitle]}
            >
                {title}
            </Text>
        )}
        <Text style={[styles.cardText, isHighlighted && styles.highlightedText]}>
            {text}
        </Text>
    </View>
);

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const WelcomeScreen = () => {
    const insets = useSafeAreaInsets();
   
    return (
        <View style={[styles.container, { paddingBottom: insets.bottom, }]}>
            <View style={styles.bottomBorder} />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={Platform.OS === 'ios'}
            >
                {/* Hero Image */}
                <View style={styles.imageContainer}>
                    {/* <Image
                        style={styles.heroImage}
                        source={require('../assets/images/welcome_page.jpg')}
                        resizeMode="cover"
                    /> */}
                    <Image
                        style={styles.heroImage}
                        source={require("../assets/images/welcome_page.jpg")}
                        placeholder={{ blurhash }}
                        contentFit="cover"
                        transition={1000}
                        cachePolicy="memory-disk"
                        priority="high"
                        accessible={true}
                    />
                    <View style={styles.imageOverlay} />
                </View>

                {/* Hero Section */}
                <HeroSection />

                {/* Stats Section */}
                <StatsSection />

                {/* Content Section */}
                <View style={styles.contentSection}>
                    <ContentCard text={CONTENT.description} />
                    <ContentCard
                        title={CONTENT.mission.title}
                        text={CONTENT.mission.text}
                        isHighlighted
                    />
                    <ContentCard
                        title={CONTENT.vision.title}
                        text={CONTENT.vision.text}
                        isHighlighted
                    />
                </View>

                {/* Bottom Spacing */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </View>
    );
};



export default WelcomeScreen;
