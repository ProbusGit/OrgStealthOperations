import React, {useEffect, useMemo} from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {Option} from '../../common/modules/types';
import {options as defaultOptions} from '../../common/modules/home';
import ImageCard from '../cards/imageCards';
import {filterOptionsByRole} from '../../common/modules/utils';
import {useAppSelector} from '../../redux/hooks/hooks';
import {useNavigation} from '@react-navigation/native';

interface OptionMenuProps {
  options?: Option[]; // Optional prop for passing options directly
  route?: any; // Route object from React Navigation, if used
}

const OptionMenu: React.FC<OptionMenuProps> = ({
  options: propsOptions,
  route,
}) => {
  const navigation = useNavigation();
  const { role } = useAppSelector(state => state.employee);
  const routeOptions = route?.params?.options || [];
  
  const optionsToUse = useMemo(() => {
    return propsOptions || routeOptions.length ? routeOptions : defaultOptions;
  }, [propsOptions, routeOptions]);

  const filteredOptions = useMemo(() => {
    return filterOptionsByRole(optionsToUse, role);
  }, [optionsToUse, role]);

  useEffect(() => {
    const parentTitle = optionsToUse[0]?.parent;
    if (parentTitle) {
      navigation.setOptions({
        title: parentTitle,
      });
    }
  }, [optionsToUse, navigation]);

  const getOptionsContainerStyle = () => {
    if (filteredOptions.length <= 2) {
      return {justifyContent: 'space-around'};
    }
    return {justifyContent: 'space-between'};
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.gradientBackground}>
        <View style={[styles.optionsContainer, getOptionsContainerStyle()]}>
          {filteredOptions.map(option => (
            <ImageCard key={option.id} option={option} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default OptionMenu;
