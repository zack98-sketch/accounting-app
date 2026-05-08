import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { Category, CategoryType } from '../types';
import { CategoryService } from '../services/CategoryService';

interface CategoryPickerProps {
  type: CategoryType;
  selectedCategoryId?: string;
  onSelect: (category: Category) => void;
  visible: boolean;
  onClose: () => void;
}

export const CategoryPicker: React.FC<CategoryPickerProps> = ({
  type,
  selectedCategoryId,
  onSelect,
  visible,
  onClose,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentCategories, setRecentCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState('');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadCategories();
  }, [type]);

  const loadCategories = () => {
    const categoryService = new CategoryService();
    const allCategories = categoryService.getCategories(type);
    const recent = categoryService.getRecentCategories(type, 6);

    setCategories(allCategories);
    setRecentCategories(recent);
  };

  const filteredCategories = searchText
    ? categories.filter(c => c.name.toLowerCase().includes(searchText.toLowerCase()))
    : categories;

  const handleSelect = (category: Category) => {
    onSelect(category);
    onClose();
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        item.id === selectedCategoryId && styles.categoryItemSelected,
      ]}
      onPress={() => handleSelect(item)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color }]}>
        <Text style={styles.iconText}>{item.icon.charAt(0).toUpperCase()}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* 头部 */}
          <View style={styles.header}>
            <Text style={styles.title}>选择分类</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>关闭</Text>
            </TouchableOpacity>
          </View>

          {/* 搜索框 */}
          <TextInput
            style={styles.searchInput}
            placeholder="搜索分类..."
            value={searchText}
            onChangeText={setSearchText}
          />

          {/* 常用分类 */}
          {!searchText && recentCategories.length > 0 && !showAll && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>常用分类</Text>
              <FlatList
                data={recentCategories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                numColumns={3}
                scrollEnabled={false}
              />
              <TouchableOpacity
                style={styles.showAllButton}
                onPress={() => setShowAll(true)}
              >
                <Text style={styles.showAllText}>查看全部</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* 全部分类 */}
          {(searchText || showAll) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {searchText ? '搜索结果' : '全部分类'}
              </Text>
              <FlatList
                data={filteredCategories}
                renderItem={renderCategoryItem}
                keyExtractor={item => item.id}
                numColumns={3}
                showsVerticalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  closeButton: {
    fontSize: 16,
    color: '#2196F3',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 12,
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 4,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  categoryItemSelected: {
    backgroundColor: '#E3F2FD',
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  categoryName: {
    fontSize: 14,
    color: '#212121',
    textAlign: 'center',
  },
  showAllButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  showAllText: {
    fontSize: 16,
    color: '#2196F3',
  },
});
