import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Avaliacao } from '~/services/evalueServices';
import images from '~/constants/images'; 

type AvaliacaoItemProps = {
    item: Avaliacao;
    expanded: boolean;
    onToggleExpand: (id: string) => void;
};

const AvaliacaoItem: React.FC<AvaliacaoItemProps> = ({ item, expanded, onToggleExpand }) => {
    return (
        <View style={styles.reviewItem}>
            <TouchableOpacity onPress={() => onToggleExpand(item.id)} style={styles.reviewHeader}>
                <Image
                    source={
                        item.fotoPerfil && item.fotoPerfil.startsWith('http')
                            ? { uri: item.fotoPerfil }
                            : images.defaultProfileImage
                    }
                    style={styles.avatar}
                />
                <View style={styles.reviewInfo}>
                    <Text style={styles.name}>{item.nome}</Text>
                    <View style={styles.ratingRow}>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <FontAwesome
                                key={index}
                                name={index < Math.floor(item.estrelas) ? 'star' : 'star-o'}
                                size={16}
                                color="#FFCD1B"
                            />
                        ))}
                        <Text style={styles.rating}>{item.estrelas.toFixed(1)}</Text>
                    </View>
                </View>
                <FontAwesome
                    name={expanded ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#fff"
                />
            </TouchableOpacity>

            {expanded && (
                <View style={styles.reviewDetails}>
                    <Text style={styles.detailsText}>{item.avaliacao}</Text>
                </View>
            )}
        </View>
    );
};

export default AvaliacaoItem;



const styles = StyleSheet.create({
    reviewItem: {
        backgroundColor: '#022036',
        borderRadius: 8,
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: '#888888',
        padding: 10,
    },
    reviewHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    reviewInfo: {
      flex: 1,
    },
    name: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rating: {
      color: '#fff',
      fontSize: 14,
      marginLeft: 5,
    },
    reviewDetails: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#022036',
      borderRadius: 8,
    },
    detailsText: {
      color: '#fff',
      fontSize: 14,
    }
});