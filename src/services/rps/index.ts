export type LuaChon = 'Kéo' | 'Búa' | 'Bao';

export const randomMay = (): LuaChon => {
	const mang: LuaChon[] = ['Kéo', 'Búa', 'Bao'];
	const chiSo = Math.floor(Math.random() * 3);
	return mang[chiSo];
};

export const soSanhKetQua = (nguoiChoi: LuaChon, may: LuaChon): string => {
	if (nguoiChoi === may) return 'Hòa';

	if (
		(nguoiChoi === 'Kéo' && may === 'Bao') ||
		(nguoiChoi === 'Búa' && may === 'Kéo') ||
		(nguoiChoi === 'Bao' && may === 'Búa')
	) {
		return 'Thắng';
	}

	return 'Thua';
};
