import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Filters {
  order?: 'Terbaru' | 'Terlama' | null;
  categories: string[];
  labels: string[];
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Filters) => void;
}

const DEFAULT_CATEGORIES = [
  'Sampah',
  'Kualitas Air',
  'Penebangan Hutan',
  'Kebakaran Hutan',
];

const DEFAULT_LABELS = [
  'Air Jernih',
  'Air Keruh',
  'Sampah Organik',
  'Sampah Anorganik',
  'Banyak Sampah',
  'Sedikit Sampah',
  'Penebangan Legal',
  'Penebangan Ilegal',
  'Kebakaran Ringan',
  'Kebakaran Besar',
];

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [order, setOrder] = useState<'Terbaru' | 'Terlama' | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [labels, setLabels] = useState<string[]>([]);

  const toggleArray = (arr: string[], value: string, setFn: (v: string[]) => void) => {
    if (arr.includes(value)) setFn(arr.filter((i) => i !== value));
    else setFn([...arr, value]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <SafeAreaView style={styles.sheet}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Ionicons name="filter" size={20} color="#1F2937" />
              <Text style={styles.headerTitle}>Filter</Text>
            </View>

            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Urutan */}
            <Text style={styles.sectionTitle}>Urutan</Text>
            <View style={styles.optionRow}>
              {['Terbaru', 'Terlama'].map((o) => (
                <TouchableOpacity
                  key={o}
                  style={styles.checkboxRow}
                  onPress={() => setOrder(order === o ? null : (o as any))}
                >
                  <View style={[styles.checkbox, order === o && styles.checkboxChecked]}>
                    {order === o && <Ionicons name="check" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.optionLabel}>{o}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Kategori */}
            <Text style={styles.sectionTitle}>Kategori</Text>
            <View style={styles.optionList}>
              {DEFAULT_CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={styles.checkboxRow}
                  onPress={() => toggleArray(categories, c, setCategories)}
                >
                  <View style={[styles.checkbox, categories.includes(c) && styles.checkboxChecked]}>
                    {categories.includes(c) && <Ionicons name="check" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.optionLabel}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Label */}
            <Text style={styles.sectionTitle}>Label</Text>
            <View style={styles.optionList}>
              {DEFAULT_LABELS.map((l) => (
                <TouchableOpacity
                  key={l}
                  style={styles.checkboxRow}
                  onPress={() => toggleArray(labels, l, setLabels)}
                >
                  <View style={[styles.checkbox, labels.includes(l) && styles.checkboxChecked]}>
                    {labels.includes(l) && <Ionicons name="check" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.optionLabel}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ height: 24 }} />
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.applyButton}
              activeOpacity={0.9}
              onPress={() => {
                onApply({ order, categories, labels });
                onClose();
              }}
            >
              <Ionicons name="filter" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.applyText}>Filter</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingTop: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  closeButton: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  optionList: {
    marginBottom: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#9CA3AF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2D5F4F',
    borderColor: '#2D5F4F',
  },
  optionLabel: {
    fontSize: 14,
    color: '#374151',
  },
  footer: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2D5F4F',
    paddingVertical: 12,
    borderRadius: 12,
  },
  applyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});