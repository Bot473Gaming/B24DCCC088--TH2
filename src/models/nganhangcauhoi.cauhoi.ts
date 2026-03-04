import { useState } from 'react';

const STORAGE_KEY = 'nhch_cau_hoi';

export type MucDoKho = 'Dễ' | 'Trung bình' | 'Khó' | 'Rất khó';

export interface CauHoi {
    id: string;
    maCauHoi: string;
    monHocId: string;
    noiDung: string;
    mucDoKho: MucDoKho;
    khoiKienThucId: string;
    createdAt: string;
}

export default () => {
    const [data, setData] = useState<CauHoi[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [visible, setVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<CauHoi | null>(null);
    const [filters, setFilters] = useState<{
        monHocId?: string;
        mucDoKho?: MucDoKho;
        khoiKienThucId?: string;
    }>({});

    const save = (list: CauHoi[]) => {
        setData(list);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const add = (record: Omit<CauHoi, 'id' | 'createdAt'>) => {
        const newRecord: CauHoi = {
            ...record,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        save([newRecord, ...data]);
    };

    const update = (id: string, record: Partial<CauHoi>) => {
        save(data.map((item) => (item.id === id ? { ...item, ...record } : item)));
    };

    const remove = (id: string) => {
        save(data.filter((item) => item.id !== id));
    };

    const handleEdit = (record: CauHoi) => {
        setEditingRecord(record);
        setVisible(true);
    };

    const handleAdd = () => {
        setEditingRecord(null);
        setVisible(true);
    };

    const filteredData = data.filter((item) => {
        if (filters.monHocId && item.monHocId !== filters.monHocId) return false;
        if (filters.mucDoKho && item.mucDoKho !== filters.mucDoKho) return false;
        if (filters.khoiKienThucId && item.khoiKienThucId !== filters.khoiKienThucId) return false;
        return true;
    });

    return {
        data,
        filteredData,
        visible,
        setVisible,
        editingRecord,
        filters,
        setFilters,
        add,
        update,
        remove,
        handleEdit,
        handleAdd,
    };
};
