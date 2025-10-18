import React from 'react';
import { View, FlatList, Text } from 'react-native';
import BrandItem from '~/components/BrandItem/BrandItem';
import { carBrands } from '~/constants/carBrand';
import styles from './styles';

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


export default Header;
