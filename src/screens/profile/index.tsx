import React from 'react';
import { ScrollView, View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppTheme } from '../../theme';
import Text from '../../components/Text';
import { RootStackParamList, screenNames } from '../../navigation/rootNavigator/types';


const Profile: React.FC = () => {
;
  const theme = useAppTheme();


  // Dummy user data for demonstration
  const userDetails = {
    employeeName: 'John Doe',
    grade: 'Manager',
    churchName: 'Saint Church',
    address: '123 Church St.',
    mobileNo: '123-456-7890',
    emailID: 'john.doe@example.com',
    joiningDate: '01/01/2020',
    birthDate: '01/01/1990',
    profileImage: 'https://example.com/profile.jpg',
    coverImage: 'https://example.com/cover.jpg',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cover Photo */}
      <Image source={{ uri: userDetails.coverImage }} style={styles.coverPhoto} />
      
      {/* Profile Picture and User Info */}
      <View style={styles.profileSection}>
        <Image source={{ uri: userDetails.profileImage }} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{userDetails.employeeName}</Text>
          <Text style={styles.userRole}>{userDetails.grade}</Text>
          <Text style={styles.userLocation}>
            {`${userDetails.churchName} | ${userDetails.address}`}
          </Text>
        </View>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate(screenNames.editProfileScreen, { userId })}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* User Details */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <Icon name="calendar-month" size={25} color={theme.colors.tertiary} />
          <Text style={styles.detailText}>{userDetails.joiningDate}</Text>
        </View>
        <View style={styles.detailRow}>
          <Icon name="cake" size={25} color={theme.colors.tertiary} />
          <Text style={styles.detailText}>{userDetails.birthDate}</Text>
        </View>
        {userDetails.emailID && (
          <View style={styles.detailRow}>
            <Icon name="email" size={25} color={theme.colors.tertiary} />
            <Text style={styles.detailText}>{userDetails.emailID}</Text>
          </View>
        )}
        {userDetails.mobileNo && (
          <View style={styles.detailRow}>
            <Icon name="phone" size={25} color={theme.colors.tertiary} />
            <Text style={styles.detailText}>{userDetails.mobileNo}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverPhoto: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: -50,
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 10,
  },
  profileInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userRole: {
    fontSize: 16,
    color: '#666',
  },
  userLocation: {
    fontSize: 14,
    color: '#888',
  },
  editButton: {
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  detailsSection: {
    paddingHorizontal: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
  },
});

export default Profile;


