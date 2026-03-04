import { Button, Card } from 'antd';
import useRPSModel from '@/models/Rps';

export default function RockPaperScissors() {
	const { luaChonNguoiChoi, luaChonMay, ketQua, lichSu, choiGame, resetGame } = useRPSModel();

	return (
		<div style={{ padding: 20 }}>
			<h1>Trò chơi Oẳn Tù Tì</h1>

			<div style={{ marginBottom: 20 }}>
				<Button onClick={() => choiGame('Kéo')}>Kéo</Button>
				<Button onClick={() => choiGame('Búa')} style={{ margin: '0 10px' }}>
					Búa
				</Button>
				<Button onClick={() => choiGame('Bao')}>Bao</Button>
			</div>

			{ketQua && (
				<Card style={{ marginBottom: 20 }}>
					<p>Bạn chọn: {luaChonNguoiChoi}</p>
					<p>Máy chọn: {luaChonMay}</p>
					<h2>Kết quả: {ketQua}</h2>
				</Card>
			)}

			<Button danger onClick={resetGame}>
				Reset
			</Button>

			<h2 style={{ marginTop: 30 }}>Lịch sử</h2>

			{lichSu.map((van, index) => (
				<Card key={index} style={{ marginBottom: 10 }}>
					<p>
						Bạn: {van.nguoiChoi} | Máy: {van.may} | KQ: {van.ketQua}
					</p>
				</Card>
			))}
		</div>
	);
}
