import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Linking,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  CircleCheckBig,
  Check,
  Shield,
  User,
  MapPin,
  Info,
  Target,
  Briefcase,
  Camera,
  Pencil,
  Globe,
  Phone,
  Mail,
  Home,
  Ring,
  Child,
  MessageSquare,
  GraduationCap,
  SmokingNo,
  Beer,
  Heart,
  PawPrint,
  Utensils,
  ChevronRight,
  Ruler,
  FileText,
  Building,
  Clock,
  Car,
  DollarSign,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Tiktok,
  Youtube,
  Link,
  PlayCircle,
} from "lucide-react-native";
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
    "fullName",
    "birthDate",
    "sex",
    "phone",
    "email",
    "address",
    "about",
    "education",
    "photoUri",
  ];

  const optionalImportantFields = [
    "marriage",
    "children",
    "communicationType",
    "interests",
    "loveLanguage",
    "pets",
    "diet",
    "signature",
  ];

  const workPreferenceFields = ["location", "contractType", "modality", "paymentType"];

  const socialFields = Object.keys(data.socialLinks || {});
  const galleryFields = [...(data.gallery?.photos || []), ...(data.gallery?.videos || [])];

  let completedRequired = 0;
  let completedOptional = 0;
  let completedWork = 0;
  let completedSocial = 0;
  let hasGallery = galleryFields.length > 0;

  requiredFields.forEach((field) => {
    if (data[field] && data[field] !== "" && data[field] !== null) {
      completedRequired++;
    }
  });

  optionalImportantFields.forEach((field) => {
    if (data[field] && data[field] !== "" && data[field] !== null) {
      completedOptional++;
    }
  });

  workPreferenceFields.forEach((field) => {
    if (data.workPreferences?.[field] && data.workPreferences[field] !== "") {
      completedWork++;
    }
  });

  socialFields.forEach((platform) => {
    if (
      data.socialLinks[platform] &&
      data.socialLinks[platform] !== "" &&
      data.socialLinks[platform] !== "twitter"
    ) {
      completedSocial++;
    }
  });

  const requiredPercentage = (completedRequired / requiredFields.length) * 100;
  const optionalPercentage = (completedOptional / optionalImportantFields.length) * 100;
  const workPercentage = (completedWork / workPreferenceFields.length) * 100;
  const socialPercentage = socialFields.length > 0 ? (completedSocial / socialFields.length) * 100 : 0;

  const overallPercentage =
    requiredPercentage * 0.4 + // 40% weight for required
    optionalPercentage * 0.25 + // 25% weight for optional
    workPercentage * 0.2 + // 20% weight for work
    socialPercentage * 0.1 + // 10% weight for social
    (hasGallery ? 5 : 0); // 5% bonus for gallery

  const isVerified = overallPercentage >= 85 && requiredPercentage === 100;

  return {
    isVerified,
    percentage: Math.min(Math.round(overallPercentage), 100),
    breakdown: {
      required: Math.round(requiredPercentage),
      optional: Math.round(optionalPercentage),
      work: Math.round(workPercentage),
      social: Math.round(socialPercentage),
      gallery: hasGallery,
    },
  };
};

// Verification Badge Component
const VerificationBadge = ({ isVerified, percentage }) => {
  if (isVerified) {
    return (
      <View className="flex-row items-center bg-custom-blue-200 px-3 py-1.5 rounded-2xl">
        <Check size={20} color="#16a34a" />
        <Text className="ml-1.5 text-sm font-semibold text-green-600">Perfil Verificado</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center bg-custom-gray-100 px-3 py-1.5 rounded-2xl">
      <Shield size={18} color="#666" />
      <Text className="ml-1.5 text-sm font-medium text-custom-gray-500">{percentage}% Complete</Text>
    </View>
  );
};

// Info Row Component
const InfoRow = ({ icon, label, value, onPress }) => (
  <TouchableOpacity
    className="flex-row items-center py-2 border-b border-custom-gray-100"
    onPress={onPress}
    disabled={!onPress}
  >
    <View className="flex-row items-center flex-1">
      {icon && React.createElement(icon, { size: 16, color: "#64748b" })}
      <Text className="text-sm font-medium text-custom-gray-500 mr-2">{label}</Text>
    </View>
    <Text className="text-sm text-custom-gray-900 font-normal">{value}</Text>
    {onPress && <ChevronRight size={20} color="#ccc" />}
  </TouchableOpacity>
);

// Section Card Component
const SectionCard = ({ title, children, icon }) => (
  <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
    <View className="flex-row items-center mb-4">
      {icon && React.createElement(icon, { size: 20, color: "#1a202c" })}
      <Text className="text-lg font-bold text-custom-gray-900">{title}</Text>
    </View>
    {children}
  </View>
);

// Interest Tags Component
const InterestTags = ({ interests }) => (
  <View className="flex-row flex-wrap">
    {interests.map((interest, index) => (
      <View key={index} className="bg-custom-blue-50 px-3 py-1.5 rounded-2xl mr-2 mb-2">
        <Text className="text-sm text-custom-blue-600 font-medium">{interest}</Text>
      </View>
    ))}
  </View>
);

// Social Links Component
const SocialLinks = ({ socialLinks, onPress }) => (
  <View className="flex-row flex-wrap">
    {Object.entries(socialLinks).map(([platform, url]) => {
      if (!url || url === "twitter") return null;

      const getIcon = (platform) => {
        const iconMap = {
          facebook: Facebook,
          instagram: Instagram,
          linkedin: Linkedin,
          twitter: Twitter,
          tiktok: Tiktok,
          youtube: Youtube,
        };
        return iconMap[platform] || Link;
      };

      return (
        <TouchableOpacity
          key={platform}
          className="flex-row items-center bg-custom-white-50 px-4 py-2.5 rounded-xl mr-3 mb-2 border border-custom-gray-200"
          onPress={() => onPress(url)}
        >
          {React.createElement(getIcon(platform), { size: 24, color: "#4A90E2" })}
          <Text className="ml-2 text-sm font-medium text-custom-gray-700">
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
    ...gallery.photos.map((uri) => ({ uri, type: "photo" })),
    ...gallery.videos.map((uri) => ({ uri, type: "video" })),
  ];

  return (
    <View className="flex-row flex-wrap justify-between">
      {allMedia.map((media, index) => (
        <View
          key={index}
          className="rounded-xl mb-2 overflow-hidden"
          style={{ width: (screenWidth - 80) / 3, height: (screenWidth - 80) / 3 }}
        >
          <Image source={{ uri: media.uri }} className="w-full h-full" />
          {media.type === "video" && (
            <View className="absolute inset-0 bg-black/30 justify-center items-center">
              <PlayCircle size={32} color="#fff" />
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
    marriage: "Sim",
    children: "3",
    photoUri: "https://randomuser.me/api/portraits/men/75.jpg",
    phone: "+55 11 91234-5678",
    email: "joao.silva@email.com",
    birthDate: "1990-05-20",
    sex: "Masculino",
    address: "Rua das Flores, 123, São Paulo - SP",
    communicationType: "Assertiva",
    education: "Ensino Superior Completo",
    smokes: false,
    drinks: true,
    interests: ["Música", "Tecnologia", "Esportes"],
    loveLanguage: "Toque Físico",
    pets: "Cachorro",
    diet: "Onívoro",
    about:
      "Sou uma pessoa dedicada, focada e apaixonada pelo que faço. Sempre busco aprender e crescer profissionalmente.",
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
      contractType: "Autônomo",
      modality: "Híbrido",
      schedule: ["Dia", "Noite"],
      mobility: ["Carro", "Moto"],
      paymentType: "Por dia",
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

  const openLink = (url) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="Profile" leftIcon="back" />

      <ScrollView
        className="px-4 pb-7"
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View className="items-center py-6 bg-zinc-200 rounded-2xl mb-4 shadow-md">
          <View className="relative mb-4">
            <Image
              source={{ uri: data.photoUri }}
              className="w-30 h-30 rounded-full border-2 border-custom-gray-400"
              style={{ width: 120, height: 120 }}
            />
            {verification.isVerified && (
              <View className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
                <CircleCheckBig size={24} color="#16a34a" />
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-custom-gray-900 text-center">
            {data.fullName}, {age}
          </Text>
          <Text className="text-base text-custom-gray-500 mb-3">{data.sex}</Text>

          <VerificationBadge isVerified={verification.isVerified} percentage={verification.percentage} />
        </View>

        {/* About Section */}
        <SectionCard title="About" icon={User}>
          <Text className="text-base leading-6 text-custom-gray-700">{data.about}</Text>
        </SectionCard>

        {/* Contact Information */}
        <SectionCard title="Contact & Location" icon={MapPin}>
          <InfoRow icon={Phone} label="Phone" value={data.phone} onPress={() => Linking.openURL(`tel:${data.phone}`)} />
          <InfoRow icon={Mail} label="Email" value={data.email} onPress={() => Linking.openURL(`mailto:${data.email}`)} />
          <InfoRow icon={Home} label="Address" value={data.address} />
        </SectionCard>

        {/* Personal Information */}
        <SectionCard title="Personal Information" icon={Info}>
          <InfoRow icon={Ring} label="Married" value={data.marriage} />
          <InfoRow icon={Child} label="Children" value={data.children} />
          <InfoRow icon={MessageSquare} label="Communication" value={data.communicationType} />
          <InfoRow icon={GraduationCap} label="Education" value={data.education} />
          <InfoRow icon={SmokingNo} label="Smoking" value={data.smokes ? "Sim" : "Não"} />
          <InfoRow icon={Beer} label="Drinking" value={data.drinks ? "Sim" : "Não"} />
          <InfoRow icon={Heart} label="Love Language" value={data.loveLanguage} />
          <InfoRow icon={PawPrint} label="Pets" value={data.pets} />
          <InfoRow icon={Utensils} label="Diet" value={data.diet} />
        </SectionCard>

        {/* Interests */}
        <SectionCard title="Interests" icon={Target}>
          <InterestTags interests={data.interests} />
        </SectionCard>

        {/* Work Preferences */}
        <SectionCard title="Work Preferences" icon={Briefcase}>
          <InfoRow icon={MapPin} label="Location" value={data.workPreferences.location} />
          <InfoRow icon={Ruler} label="Max Distance" value={`${data.workPreferences.maxDistanceKm} km`} />
          <InfoRow icon={FileText} label="Contract Type" value={data.workPreferences.contractType} />
          <InfoRow icon={Building} label="Work Mode" value={data.workPreferences.modality} />
          <InfoRow icon={Clock} label="Schedule" value={data.workPreferences.schedule.join(", ")} />
          <InfoRow icon={Car} label="Mobility" value={data.workPreferences.mobility.join(", ")} />
          <InfoRow icon={DollarSign} label="Payment" value={data.workPreferences.paymentType} />
        </SectionCard>

        {/* Gallery */}
        <SectionCard title="Gallery" icon={Camera}>
          <Gallery gallery={data.gallery} />
        </SectionCard>

        {/* Signature */}
        {data.signature && (
          <SectionCard title="Signature" icon={Pencil}>
            <Image
              source={{ uri: data.signature }}
              className="w-full rounded-lg"
              style={{ height: 120 }}
              resizeMode="contain"
            />
          </SectionCard>
        )}

        {/* Social Media */}
        <SectionCard title="Social Media" icon={Globe}>
          <SocialLinks socialLinks={data.socialLinks} onPress={openLink} />
        </SectionCard>
      </ScrollView>
    </View>
  );
}