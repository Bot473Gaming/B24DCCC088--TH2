import { useState } from 'react';

const STORAGE_KEY = 'nhch_khoi_kien_thuc';

export interface KhoiKienThuc {
    id: string;
    ma: string;
    ten: string;
    createdAt: string;
}

export default () => {
    const [data, setData] = useState<KhoiKienThuc[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [visible, setVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<KhoiKienThuc | null>(null);

    const save = (list: KhoiKienThuc[]) => {
        setData(list);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const add = (record: Omit<KhoiKienThuc, 'id' | 'createdAt'>) => {
        const newRecord: KhoiKienThuc = {
            ...record,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        save([newRecord, ...data]);
    };

    const update = (id: string, record: Partial<KhoiKienThuc>) => {
        save(data.map((item) => (item.id === id ? { ...item, ...record } : item)));
    };

    const remove = (id: string) => {
        save(data.filter((item) => item.id !== id));
    };

    const handleEdit = (record: KhoiKienThuc) => {
        setEditingRecord(record);
        setVisible(true);
    };

    const handleAdd = () => {
        setEditingRecord(null);
        setVisible(true);
    };

    return {
        data,
        visible,
        setVisible,
        editingRecord,
        add,
        update,
        remove,
        handleEdit,
        handleAdd,
    };
};
