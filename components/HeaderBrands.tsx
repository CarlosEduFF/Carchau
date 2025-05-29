import React from 'react';
import { View, FlatList, Text } from 'react-native';
import BrandItem from '~/components/BrandItem';
import { carBrands } from '~/constants/carBrand';

interface HeaderProps {
    selectedBrand: string | null;
    onSelectBrand: (brandName: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ selectedBrand, onSelectBrand }) => {
    return (
        <View>
            <View style={{ flexDirection: 'column' }}>
                <Text style={styles.title}>Marcas mais procuradas:</Text>
                <FlatList
                    data={carBrands}
                    renderItem={({ item }) => (
                        <BrandItem item={item} selectedBrand={selectedBrand} onSelect={onSelectBrand} />
                    )}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.brandsCarousel}
                />
            </View>

            <Text style={styles.title}>Veículos Disponíveis</Text>
        </View>
    );
};

import { StyleSheet } from "react-native";


const styles = StyleSheet.create({
    title: {
        color: '#F2A51A',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    brandsCarousel: {
        marginBottom: 20,

    },
});
export default Header;
