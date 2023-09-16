import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';

export interface DropdownItemInterface {
  label: string;
  value: number;
  search: string;
}

interface Props {
  data?: DropdownItemInterface[];
  state?: DropdownItemInterface;
  onSelected?: (item: DropdownItemInterface) => void;
}

const DropdownSelector: React.FC<Props> = props => {
  const {data, state, onSelected} = props;

  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (state?.value || isFocus) {
      return (
        // eslint-disable-next-line react-native/no-inline-styles
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>State</Text>
      );
    }
    return null;
  };

  const onChange = (item: DropdownItemInterface) => {
    setIsFocus(false);
    onSelected?.(item);
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && styles.color]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data ?? []}
        search
        maxHeight={500}
        minHeight={100}
        labelField="label"
        valueField="value"
        searchField="search"
        placeholder={!isFocus ? 'Select state' : '...'}
        searchPlaceholder="Search..."
        value={state?.value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={onChange}
      />
    </View>
  );
};

export default DropdownSelector;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  borderColor: {
    borderColor: 'blue',
  },
  color: {
    borderColor: 'blue',
  },
});
