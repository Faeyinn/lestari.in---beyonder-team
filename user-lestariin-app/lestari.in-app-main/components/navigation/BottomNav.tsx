import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface NavItem {
  name: string;
  label: string;
  icon: any;
  iconType: 'ionicons' | 'material';
  route: '/map' | '/chat' | '/report' | '/laporan' | '/profile';
}

const navItems: NavItem[] = [
  {
    name: 'map',
    label: 'Map',
    icon: 'map-outline',
    iconType: 'ionicons',
    route: '/map',
  },
  {
    name: 'chat',
    label: 'Chat',
    icon: 'chatbubble-outline',
    iconType: 'ionicons',
    route: '/chat',
  },
  {
    name: 'report',
    label: 'Laporkan',
    icon: 'camera',
    iconType: 'ionicons',
    route: '/report',
  },
  {
    name: 'laporan',
    label: 'Laporan',
    icon: 'description',
    iconType: 'material',
    route: '/laporan',
  },
  {
    name: 'profile',
    label: 'Profil',
    icon: 'person-outline',
    iconType: 'ionicons',
    route: '/profile',
  },
];

interface BottomNavProps {
  activeRoute?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeRoute }) => {
  const router = useRouter();
  const pathname = usePathname();

  const handlePress = (route: NavItem['route']) => {
    router.push(route);
  };

  // color palette
  const NAV_BG = '#2D5F4F';
  const ICON_ACTIVE = '#FFFFFF';
  const ICON_INACTIVE = 'rgba(255,255,255,0.8)';
  const LABEL_ACTIVE = '#FFFFFF';
  const LABEL_INACTIVE = 'rgba(255,255,255,0.85)';

  return (
    <View style={[styles.container, { backgroundColor: NAV_BG }]}>
      <View style={[styles.navBar, { backgroundColor: NAV_BG }]}>
        {navItems.map((item, index) => {
          const isActive = activeRoute === item.name || pathname.includes(item.route);
          const isCenterButton = item.name === 'report';

          if (isCenterButton) {
            return (
              <TouchableOpacity
                key={item.name}
                style={styles.centerButtonContainer}
                onPress={() => handlePress(item.route)}
                activeOpacity={0.8}
              >
                <View style={styles.centerButton}>
                  <Ionicons name={item.icon} size={32} color="#FFFFFF" />
                </View>
                <Text style={[styles.centerLabel, { color: LABEL_ACTIVE }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          }

          const iconColor = isActive ? ICON_ACTIVE : ICON_INACTIVE;
          const labelColor = isActive ? LABEL_ACTIVE : LABEL_INACTIVE;

          return (
            <TouchableOpacity
              key={item.name}
              style={styles.navItem}
              onPress={() => handlePress(item.route)}
              activeOpacity={0.7}
            >
              {item.iconType === 'ionicons' ? (
                <Ionicons
                  name={item.icon}
                  size={24}
                  color={iconColor}
                />
              ) : (
                <MaterialIcons
                  name={item.icon}
                  size={24}
                  color={iconColor}
                />
              )}
              <Text
                style={[
                  styles.navLabel,
                  { color: labelColor },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  navBar: {
    flexDirection: 'row',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -32,
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#4A9D6F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
    borderWidth: 5,
    borderColor: '#FFFFFF',
  },
  centerLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
});