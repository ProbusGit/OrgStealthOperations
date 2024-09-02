import React from 'react';
import {
  Modal,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import {Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import useStyles from './useStyles';
import {useNavigation} from '@react-navigation/native';
import {NavigationActionType, screenNames} from '../../../rootNavigator/types';

interface ServiceItem {
  id: number;
  name: string;
  icon: string;
}

interface ServiceCategory {
  description: string;
  items: ServiceItem[];
}

interface Services {
  requests: ServiceCategory;
}

interface ServicesModalProps {
  visible: boolean;
  onClose: () => void;
  services: Services;
}

const ServicesModal: React.FC<ServicesModalProps> = ({
  visible,
  onClose,
  services,
}) => {
  const navigation = useNavigation<NavigationActionType>();
  const styles = useStyles();

  const handleNavigation = (title: string) => {
    navigation.navigate(screenNames.requestApproveScreen, {title});
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalBackground}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.modalContainer}>
          <Card elevation={5} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Services</Text>
            </View>
            {Object.entries(services).map(([section, serviceCategory]) => (
              <View key={section} style={styles.sectionContainer}>
                <Text style={styles.sectionHeader}>{section}</Text>
                <Text style={styles.sectionDescription}>
                  {serviceCategory.description}
                </Text>
                <View style={styles.itemWrapper}>
                  {serviceCategory.items.map(item => (
                    <Pressable
                      onPress={() => handleNavigation(item.name)}
                      key={item.id}
                      style={styles.itemContainer}>
                      <View style={styles.iconContainer}>
                        <Icon name={item.icon} size={24} color="black" />
                      </View>
                      <Text numberOfLines={2} style={styles.itemName}>
                        {item.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </Card>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ServicesModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.8,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    margin: 10,
  },
  sectionContainer: {
    marginVertical: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#888', // Adjust color
    marginHorizontal: 10,
    marginBottom: 10,
    textAlign: 'center', // Center the text
  },
  itemWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 5,
  },
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    marginBottom: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  iconContainer: {
    marginBottom: 5,
  },
  itemName: {
    textAlign: 'center',
  },
});
