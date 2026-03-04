import { useState } from 'react';
import type { MucDoKho, CauHoi } from './nganhangcauhoi.cauhoi';

const STORAGE_KEY_DETHI = 'nhch_de_thi';
const STORAGE_KEY_CAUTRUC = 'nhch_cau_truc_de';

export interface CauTrucYeuCau {
    mucDoKho: MucDoKho;
    khoiKienThucId: string;
    soLuong: number;
}

export interface CauTrucDe {
    id: string;
    ten: string;
    monHocId: string;
    yeuCau: CauTrucYeuCau[];
    createdAt: string;
}

export interface DeThi {
    id: string;
    ten: string;
    monHocId: string;
    cauTrucDeId?: string;
    cauHoiIds: string[];
    createdAt: string;
}

export default () => {
    const [deThiList, setDeThiList] = useState<DeThi[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_DETHI);
        return saved ? JSON.parse(saved) : [];
    });
    const [cauTrucList, setCauTrucList] = useState<CauTrucDe[]>(() => {
        const saved = localStorage.getItem(STORAGE_KEY_CAUTRUC);
        return saved ? JSON.parse(saved) : [];
    });
    const [visibleTaoDe, setVisibleTaoDe] = useState(false);
    const [visibleXemDe, setVisibleXemDe] = useState(false);
    const [visibleCauTruc, setVisibleCauTruc] = useState(false);
    const [selectedDeThi, setSelectedDeThi] = useState<DeThi | null>(null);

    const saveDeThiList = (list: DeThi[]) => {
        setDeThiList(list);
        localStorage.setItem(STORAGE_KEY_DETHI, JSON.stringify(list));
    };

    const saveCauTrucList = (list: CauTrucDe[]) => {
        setCauTrucList(list);
        localStorage.setItem(STORAGE_KEY_CAUTRUC, JSON.stringify(list));
    };

    const taoDeThi = (
        ten: string,
        monHocId: string,
        yeuCau: CauTrucYeuCau[],
        allCauHoi: CauHoi[],
        cauTrucDeId?: string,
    ): { success: boolean; error?: string; deThi?: DeThi } => {
        const cauHoiMonHoc = allCauHoi.filter((ch) => ch.monHocId === monHocId);
        const selectedIds: string[] = [];
        const errors: string[] = [];

        for (const yc of yeuCau) {
            const pool = cauHoiMonHoc.filter(
                (ch) =>
                    ch.mucDoKho === yc.mucDoKho &&
                    ch.khoiKienThucId === yc.khoiKienThucId &&
                    !selectedIds.includes(ch.id),
            );

            if (pool.length < yc.soLuong) {
                errors.push(
                    `Thiếu câu hỏi mức "${yc.mucDoKho}" khối kiến thức ID "${yc.khoiKienThucId}": cần ${yc.soLuong}, có ${pool.length}`,
                );
                continue;
            }

            const shuffled = [...pool].sort(() => Math.random() - 0.5);
            selectedIds.push(...shuffled.slice(0, yc.soLuong).map((ch) => ch.id));
        }

        if (errors.length > 0) {
            return { success: false, error: errors.join('\n') };
        }

        const deThi: DeThi = {
            id: Date.now().toString(),
            ten,
            monHocId,
            cauTrucDeId,
            cauHoiIds: selectedIds,
            createdAt: new Date().toISOString(),
        };

        saveDeThiList([deThi, ...deThiList]);
        return { success: true, deThi };
    };

    const xoaDeThi = (id: string) => {
        saveDeThiList(deThiList.filter((dt) => dt.id !== id));
    };

    const luuCauTruc = (ten: string, monHocId: string, yeuCau: CauTrucYeuCau[]) => {
        const cauTruc: CauTrucDe = {
            id: Date.now().toString(),
            ten,
            monHocId,
            yeuCau,
            createdAt: new Date().toISOString(),
        };
        saveCauTrucList([cauTruc, ...cauTrucList]);
        return cauTruc;
    };

    const xoaCauTruc = (id: string) => {
        saveCauTrucList(cauTrucList.filter((ct) => ct.id !== id));
    };

    return {
        deThiList,
        cauTrucList,
        visibleTaoDe,
        setVisibleTaoDe,
        visibleXemDe,
        setVisibleXemDe,
        visibleCauTruc,
        setVisibleCauTruc,
        selectedDeThi,
        setSelectedDeThi,
        taoDeThi,
        xoaDeThi,
        luuCauTruc,
        xoaCauTruc,
    };
};
