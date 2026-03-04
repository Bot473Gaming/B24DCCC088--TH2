import { useState } from 'react';
import { randomMay, soSanhKetQua, type LuaChon } from '@/services/rps';

interface LichSu {
	nguoiChoi: LuaChon;
	may: LuaChon;
	ketQua: string;
}

export default function useRPSModel() {
	const [luaChonNguoiChoi, setLuaChonNguoiChoi] = useState<LuaChon | null>(null);
	const [luaChonMay, setLuaChonMay] = useState<LuaChon | null>(null);
	const [ketQua, setKetQua] = useState<string>('');
	const [lichSu, setLichSu] = useState<LichSu[]>([]);

	const choiGame = (luaChon: LuaChon) => {
		const may = randomMay();
		const ketQuaMoi = soSanhKetQua(luaChon, may);

		setLuaChonNguoiChoi(luaChon);
		setLuaChonMay(may);
		setKetQua(ketQuaMoi);

		setLichSu([{ nguoiChoi: luaChon, may, ketQua: ketQuaMoi }, ...lichSu]);
	};

	const resetGame = () => {
		setLuaChonNguoiChoi(null);
		setLuaChonMay(null);
		setKetQua('');
		setLichSu([]);
	};

	return {
		luaChonNguoiChoi,
		luaChonMay,
		ketQua,
		lichSu,
		choiGame,
		resetGame,
	};
}
