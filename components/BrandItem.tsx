import React from 'react';
import { Pressable, Image } from 'react-native';
import { CarBrand } from '~/types/CarBrand';

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
import { StyleSheet } from "react-native";


const styles = StyleSheet.create({

    brandContainer: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#f2a51a',
        padding: 20,
    },
});


export default BrandItem;
