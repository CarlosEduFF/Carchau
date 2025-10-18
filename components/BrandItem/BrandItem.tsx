import React from 'react';
import { Pressable, Image } from 'react-native';
import { CarBrand } from '~/types/Ads/CarBrand';
import styles from './styles';

interface BrandItemProps {
    item: CarBrand;
    selectedBrand: string | null;
    onSelect: (brandName: string | null) => void;

}

const BrandItem: React.FC<BrandItemProps> = ({ item, selectedBrand, onSelect }) => {
    const isSelected = selectedBrand === item.name;

    const handlePress = () => {
        if (isSelected) {
            onSelect(null);
        } else {
            onSelect(item.name);
        }
    };

    return (
        <Pressable
            onPress={handlePress}
            style={[
                styles.brandContainer,
                isSelected && {
                    width: 70,
                    height: 70,
                    borderRadius: 50,
                    borderWidth: 2,
                    borderColor: '#a40101',
                    padding: 20,
                },
            ]}
        >
            <Image source={item.image} style={styles.brandImage} />
        </Pressable>
    );
};


export default BrandItem;
