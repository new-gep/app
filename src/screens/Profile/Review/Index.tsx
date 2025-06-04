import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Header from "~/src/layout/Header";

const screenWidth = Dimensions.get("window").width;
const spacing = 22;
const CARD_SIZE = (screenWidth - spacing * 4) / 3;

const ageFromBirthDate = (birthDate) => {
  const birth = new Date(birthDate);
  const diffMs = Date.now() - birth.getTime();
  const ageDt = new Date(diffMs);
  return Math.abs(ageDt.getUTCFullYear() - 1970);
};

// Profile verification algorithm
const calculateProfileCompleteness = (data) => {
  const requiredFields = [
    'fullName', 'birthDate', 'sex', 'phone', 'email', 'address',
    'about', 'education', 'photoUri'
  ];
  
  const optionalImportantFields = [
    'marriage', 'children', 'communicationType', 'interests',
    'loveLanguage', 'pets', 'diet', 'signature'
  ];
  
  const workPreferenceFields = [
    'location', 'contractType', 'modality', 'paymentType'
  ];
  
  const socialFields = Object.keys(data.socialLinks || {});
  const galleryFields = [
    ...(data.gallery?.photos || []),
    ...(data.gallery?.videos || [])
  ];
  
  let completedRequired = 0;
  let completedOptional = 0;
  let completedWork = 0;
  let completedSocial = 0;
  let hasGallery = galleryFields.length > 0;
  
  // Check required fields
  requiredFields.forEach(field => {
    if (data[field] && data[field] !== '' && data[field] !== null) {
      completedRequired++;
    }
  });
  
  // Check optional fields
  optionalImportantFields.forEach(field => {
    if (data[field] && data[field] !== '' && data[field] !== null) {
      completedOptional++;
    }
  });
  
  // Check work preferences
  workPreferenceFields.forEach(field => {
    if (data.workPreferences?.[field] && data.workPreferences[field] !== '') {
      completedWork++;
    }
  });
  
  // Check social links
  socialFields.forEach(platform => {
    if (data.socialLinks[platform] && data.socialLinks[platform] !== '' && data.socialLinks[platform] !== 'twitter') {
      completedSocial++;
    }
  });
  
  const requiredPercentage = (completedRequired / requiredFields.length) * 100;
  const optionalPercentage = (completedOptional / optionalImportantFields.length) * 100;
  const workPercentage = (completedWork / workPreferenceFields.length) * 100;
  const socialPercentage = socialFields.length > 0 ? (completedSocial / socialFields.length) * 100 : 0;
  
  const overallPercentage = (
    (requiredPercentage * 0.4) + // 40% weight for required
    (optionalPercentage * 0.25) + // 25% weight for optional
    (workPercentage * 0.2) + // 20% weight for work
    (socialPercentage * 0.1) + // 10% weight for social
    (hasGallery ? 5 : 0) // 5% bonus for gallery
  );
  
  const isVerified = overallPercentage >= 85 && requiredPercentage === 100;
  
  return {
    isVerified,
    percentage: Math.min(Math.round(overallPercentage), 100),
    breakdown: {
      required: Math.round(requiredPercentage),
      optional: Math.round(optionalPercentage),
      work: Math.round(workPercentage),
      social: Math.round(socialPercentage),
      gallery: hasGallery
    }
  };
};

// Verification Badge Component
const VerificationBadge = ({ isVerified, percentage }) => {
  if (isVerified) {
    return (
      <View style={styles.verifiedBadge}>
        <MaterialCommunityIcons name="check-decagram" size={20} color="#1DA1F2" />
        <Text style={styles.verifiedText}>Verified Profile</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.unverifiedBadge}>
      <MaterialCommunityIcons name="shield-outline" size={18} color="#666" />
      <Text style={styles.unverifiedText}>{percentage}% Complete</Text>
    </View>
  );
};

// Info Row Component
const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity 
    style={styles.infoRow} 
    onPress={onPress}
    disabled={!onPress}
  >
    <View style={styles.infoRowLeft}>
      <Text style={styles.infoIcon}>{icon}</Text>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
    {onPress && (
      <MaterialCommunityIcons name="chevron-right" size={20} color="#ccc" />
    )}
  </TouchableOpacity>
);

// Section Card Component
const SectionCard = ({ title, children, icon }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      {icon && <Text style={styles.sectionIcon}>{icon}</Text>}
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    {children}
  </View>
);

// Interest Tags Component
const InterestTags = ({ interests }) => (
  <View style={styles.tagsContainer}>
    {interests.map((interest, index) => (
      <View key={index} style={styles.tag}>
        <Text style={styles.tagText}>{interest}</Text>
      </View>
    ))}
  </View>
);

// Social Links Component
const SocialLinks = ({ socialLinks, onPress }) => (
  <View style={styles.socialContainer}>
    {Object.entries(socialLinks).map(([platform, url]) => {
      if (!url || url === 'twitter') return null;
      
      const getIconName = (platform) => {
        const iconMap = {
          facebook: 'facebook',
          instagram: 'instagram',
          linkedin: 'linkedin',
          twitter: 'twitter',
          tiktok: 'tiktok',
          youtube: 'youtube'
        };
        return iconMap[platform] || 'link';
      };
      
      return (
        <TouchableOpacity
          key={platform}
          style={styles.socialButton}
          onPress={() => onPress(url)}
        >
          <FontAwesome5 
            name={getIconName(platform)} 
            size={24} 
            color="#4A90E2" 
          />
          <Text style={styles.socialLabel}>
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// Gallery Component
const Gallery = ({ gallery }) => {
  const allMedia = [
    ...gallery.photos.map(uri => ({ uri, type: 'photo' })),
    ...gallery.videos.map(uri => ({ uri, type: 'video' })),
  ];
  
  return (
    <View style={styles.galleryGrid}>
      {allMedia.map((media, index) => (
        <View key={index} style={styles.galleryItem}>
          <Image source={{ uri: media.uri }} style={styles.galleryImage} />
          {media.type === 'video' && (
            <View style={styles.videoOverlay}>
              <MaterialCommunityIcons name="play-circle" size={32} color="#fff" />
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default function EnhancedProfile() {
  const data = {
    fullName: "João da Silva",
    marriage: "Yes",
    children: "3",
    photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
    phone: "+55 11 91234-5678",
    email: "joao.silva@email.com",
    birthDate: "1990-05-20",
    sex: "Male",
    address: "Rua das Flores, 123, São Paulo - SP",
    communicationType: "Assertive",
    education: "Higher Education Complete",
    smokes: false,
    drinks: true,
    interests: ["Music", "Technology", "Sports"],
    loveLanguage: "Physical Touch",
    pets: "Dog",
    diet: "Omnivore",
    about: "I'm a dedicated, focused person passionate about what I do. I always seek to learn and grow professionally.",
    signature: "https://i.imgur.com/TBJ72m5.jpeg",
    socialLinks: {
      facebook: "https://facebook.com/joaosilva",
      instagram: "https://instagram.com/joaosilva",
      linkedin: "https://linkedin.com/in/joaosilva",
      twitter: "",
      tiktok: "https://github.com/joaosilva",
      youtube: "",
    },
    workPreferences: {
      location: "São Paulo - SP",
      maxDistanceKm: 50,
      allowFurtherDistance: true,
      contractType: "Contractor",
      modality: "Hybrid",
      schedule: ["Day", "Night"],
      mobility: ["Car", "Motorcycle"],
      paymentType: "Per day",
    },
    gallery: {
      photos: [
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      ],
      videos: [
        "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=400&q=80",
      ],
    },
  };

  const age = ageFromBirthDate(data.birthDate);
  const verification = calculateProfileCompleteness(data);

  const openLink = (url:any) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={styles.container}>
      <Header title="Profile" leftIcon="back" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: data.photoUri }}
              style={styles.profileImage}
              resizeMode="cover"
            />
            {verification.isVerified && (
              <View style={styles.verifiedIconContainer}>
                <MaterialCommunityIcons 
                  name="check-decagram" 
                  size={24} 
                  color="#1DA1F2" 
                />
              </View>
            )}
          </View>
          
          <Text style={styles.profileName}>
            {data.fullName}, {age}
          </Text>
          <Text style={styles.profileSubtitle}>{data.sex}</Text>
          
          <VerificationBadge 
            isVerified={verification.isVerified} 
            percentage={verification.percentage} 
          />
        </View>

        {/* About Section */}
        <SectionCard title="About" icon="👤">
          <Text style={styles.aboutText}>{data.about}</Text>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact & Location" icon="📍">
          <InfoRow 
            icon="📱" 
            label="Phone" 
            value={data.phone}
            onPress={() => Linking.openURL(`tel:${data.phone}`)}
          />
          <InfoRow 
            icon="✉️" 
            label="Email" 
            value={data.email}
            onPress={() => Linking.openURL(`mailto:${data.email}`)}
          />
          <InfoRow 
            icon="🏠" 
            label="Address" 
            value={data.address}
          />
        </SectionCard>

        {/* Personal Information */}
        <SectionCard title="Personal Information" icon="ℹ️">
          <InfoRow icon="💍" label="Married" value={data.marriage} onPress={undefined} />
          <InfoRow icon="👶" label="Children" value={data.children} onPress={undefined} />
          <InfoRow icon="💬" label="Communication" value={data.communicationType} onPress={undefined} />
          <InfoRow icon="🎓" label="Education" value={data.education} onPress={undefined} />
          <InfoRow icon="🚭" label="Smoking" value={data.smokes ? "Yes" : "No"} onPress={undefined} />
          <InfoRow icon="🍺" label="Drinking" value={data.drinks ? "Yes" : "No"} onPress={undefined} />
          <InfoRow icon="❤️" label="Love Language" value={data.loveLanguage} onPress={undefined} />
          <InfoRow icon="🐕" label="Pets" value={data.pets} onPress={undefined} />
          <InfoRow icon="🍽️" label="Diet" value={data.diet} onPress={undefined} />
        </SectionCard>

        {/* Interests */}
        <SectionCard title="Interests" icon="🎯">
          <InterestTags interests={data.interests} />
        </SectionCard>

        {/* Work Preferences */}
        <SectionCard title="Work Preferences" icon="💼">
          <InfoRow icon="📍" label="Location" value={data.workPreferences.location} />
          <InfoRow 
            icon="📏" 
            label="Max Distance" 
            value={`${data.workPreferences.maxDistanceKm} km`} 
          />
          <InfoRow 
            icon="📋" 
            label="Contract Type" 
            value={data.workPreferences.contractType} 
          />
          <InfoRow 
            icon="🏢" 
            label="Work Mode" 
            value={data.workPreferences.modality} 
          />
          <InfoRow 
            icon="⏰" 
            label="Schedule" 
            value={data.workPreferences.schedule.join(", ")} 
          />
          <InfoRow 
            icon="🚗" 
            label="Mobility" 
            value={data.workPreferences.mobility.join(", ")} 
          />
          <InfoRow 
            icon="💰" 
            label="Payment" 
            value={data.workPreferences.paymentType} 
          />
        </SectionCard>

        {/* Gallery */}
        <SectionCard title="Gallery" icon="📸">
          <Gallery gallery={data.gallery} />
        </SectionCard>

        {/* Signature */}
        {data.signature && (
          <SectionCard title="Signature" icon="✍️">
            <Image
              source={{ uri: data.signature }}
              style={styles.signatureImage}
              resizeMode="contain"
            />
          </SectionCard>
        )}

        {/* Social Media */}
        <SectionCard title="Social Media" icon="🌐">
          <SocialLinks socialLinks={data.socialLinks} onPress={openLink} />
        </SectionCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  
  // Profile Header Styles
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#e2e8f0',
  },
  verifiedIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 12,
  },
  
  // Verification Badge Styles
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dbeafe',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#1DA1F2',
  },
  unverifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  unverifiedText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  
  // Section Card Styles
  sectionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
  },
  
  // Info Row Styles
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 12,
    width: 20,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#1a202c',
    fontWeight: '400',
    flex: 2,
    textAlign: 'right',
  },
  
  // About Section
  aboutText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  
  // Tags Styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '500',
  },
  
  // Social Links Styles
  socialContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  socialLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  
  // Gallery Styles
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  galleryItem: {
    width: (screenWidth - 80) / 3,
    height: (screenWidth - 80) / 3,
    borderRadius: 12,
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Signature Styles
  signatureImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
});