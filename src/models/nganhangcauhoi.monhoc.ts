import { useState } from 'react';

const STORAGE_KEY = 'nhch_mon_hoc';

export interface MonHoc {
    id: string;
    maMon: string;
    tenMon: string;
    soTinChi: number;
    createdAt: string;
}

export default () => {
    const [data, setData] = useState<MonHoc[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });
    const [visible, setVisible] = useState(false);
    const [editingRecord, setEditingRecord] = useState<MonHoc | null>(null);

    const save = (list: MonHoc[]) => {
        setData(list);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    };

    const add = (record: Omit<MonHoc, 'id' | 'createdAt'>) => {
        const newRecord: MonHoc = {
            ...record,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
        };
        save([newRecord, ...data]);
    };

    const update = (id: string, record: Partial<MonHoc>) => {
        save(data.map((item) => (item.id === id ? { ...item, ...record } : item)));
    };

    const remove = (id: string) => {
        save(data.filter((item) => item.id !== id));
    };

    const handleEdit = (record: MonHoc) => {
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
