import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';

const NotificationScreen: React.FC = () => {
  // Static list of notifications
  const notifications = [
    {
      notificationId: '1',
      title: 'Welcome to the App!',
      body: 'This is your first notification.',
      createdAt: moment().subtract(2, 'days').unix(),
      read: false,
      screenName: 'Home',
    },
    {
      notificationId: '2',
      title: 'New Feature Available',
      body: 'Check out the latest features in the app.',
      createdAt: moment().subtract(1, 'days').unix(),
      read: true,
      screenName: 'Features',
    },
    {
      notificationId: '3',
      title: 'Reminder',
      body: 'Don’t forget to complete your profile.',
      createdAt: moment().subtract(4, 'hours').unix(),
      read: false,
      screenName: 'Profile',
    },
  ];

  const renderItem = ({ item }) => (
    <View style={[styles.notificationItem, { backgroundColor: item.read ? '#fff' : '#d3d3d3' }]}>
      <TouchableOpacity style={styles.notificationContent}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.body}</Text>
        <Text style={styles.date}>{moment.unix(item.createdAt).format('MMMM Do YYYY, h:mm:ss a')}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton}>
        <Ionicons name="close-circle" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderItem}
        keyExtractor={item => item.notificationId.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    paddingTop: 20,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    elevation: 2,
  },
  notificationContent: {
    flex: 1,
  },
  removeButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    color: 'black',
  },
  description: {
    fontSize: 14,
    color: 'gray',
  },
  date: {
    fontSize: 12,
    color: 'blue',
    marginTop: 5,
  },
});

export default NotificationScreen;
