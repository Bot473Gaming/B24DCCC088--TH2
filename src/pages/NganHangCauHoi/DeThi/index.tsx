import { useState } from 'react';
import {
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    List,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Tooltip,
    Typography,
    message,
} from 'antd';
import {
    DeleteOutlined,
    EyeOutlined,
    FileAddOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    SaveOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import { useModel } from 'umi';
import type { CauTrucYeuCau } from '@/models/nganhangcauhoi.dethi';
import type { MucDoKho } from '@/models/nganhangcauhoi.cauhoi';
import moment from 'moment';

const { Text, Title } = Typography;

const mucDoOptions: MucDoKho[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const mucDoColor: Record<string, string> = {
    'Dễ': 'green',
    'Trung bình': 'blue',
    'Khó': 'orange',
    'Rất khó': 'red',
};

const DeThiPage = () => {
    const {
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
    } = useModel('nganhangcauhoi.dethi');
    const { data: monHocList } = useModel('nganhangcauhoi.monhoc');
    const { data: khoiKTList } = useModel('nganhangcauhoi.khoikienthuc');
    const { data: allCauHoi } = useModel('nganhangcauhoi.cauhoi');

    const [form] = Form.useForm();
    const [cauTrucForm] = Form.useForm();
    const [yeuCauList, setYeuCauList] = useState<CauTrucYeuCau[]>([]);
    const [selectedMonHoc, setSelectedMonHoc] = useState<string>('');

    const getMonHocTen = (id: string) => monHocList.find((m) => m.id === id)?.tenMon || id;
    const getKhoiKTTen = (id: string) => khoiKTList.find((k) => k.id === id)?.ten || id;
    const getCauHoiById = (id: string) => allCauHoi.find((ch) => ch.id === id);

    const deThiColumns = [
        {
            title: 'Tên đề thi',
            dataIndex: 'ten',
        },
        {
            title: 'Môn học',
            dataIndex: 'monHocId',
            width: 150,
            render: (val: string) => getMonHocTen(val),
        },
        {
            title: 'Số câu',
            dataIndex: 'cauHoiIds',
            width: 100,
            align: 'center' as const,
            render: (ids: string[]) => <Tag color='blue'>{ids.length} câu</Tag>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 160,
            align: 'center' as const,
            render: (val: string) => moment(val).format('HH:mm DD/MM/YYYY'),
        },
        {
            title: 'Thao tác',
            width: 120,
            align: 'center' as const,
            render: (record: any) => (
                <>
                    <Tooltip title='Xem đề'>
                        <Button
                            type='link'
                            icon={<EyeOutlined />}
                            onClick={() => {
                                setSelectedDeThi(record);
                                setVisibleXemDe(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Popconfirm title='Xóa đề thi này?' onConfirm={() => xoaDeThi(record.id)}>
                            <Button danger type='link' icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ];

    const addYeuCau = () => {
        setYeuCauList([...yeuCauList, { mucDoKho: 'Dễ', khoiKienThucId: '', soLuong: 1 }]);
    };

    const removeYeuCau = (index: number) => {
        setYeuCauList(yeuCauList.filter((_, i) => i !== index));
    };

    const updateYeuCau = (index: number, field: string, value: any) => {
        const updated = [...yeuCauList];
        (updated[index] as any)[field] = value;
        setYeuCauList(updated);
    };

    const handleTaoDe = () => {
        form.validateFields().then((values) => {
            if (yeuCauList.length === 0) {
                message.error('Vui lòng thêm ít nhất một yêu cầu câu hỏi!');
                return;
            }

            for (const yc of yeuCauList) {
                if (!yc.khoiKienThucId) {
                    message.error('Vui lòng chọn khối kiến thức cho tất cả yêu cầu!');
                    return;
                }
            }

            const result = taoDeThi(values.ten, values.monHocId, yeuCauList, allCauHoi);

            if (!result.success) {
                Modal.error({
                    title: 'Không đủ câu hỏi',
                    content: (
                        <div>
                            {result.error?.split('\n').map((line, i) => (
                                <p key={i} style={{ color: '#ff4d4f', margin: '4px 0' }}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    ),
                });
                return;
            }

            message.success('Tạo đề thi thành công!');
            setVisibleTaoDe(false);
            form.resetFields();
            setYeuCauList([]);
            setSelectedMonHoc('');
        });
    };

    const handleLuuCauTruc = () => {
        cauTrucForm.validateFields().then((values) => {
            if (yeuCauList.length === 0) {
                message.error('Vui lòng thêm ít nhất một yêu cầu!');
                return;
            }
            luuCauTruc(values.tenCauTruc, selectedMonHoc, yeuCauList);
            message.success('Đã lưu cấu trúc đề!');
            setVisibleCauTruc(false);
            cauTrucForm.resetFields();
        });
    };

    const applyCauTruc = (cauTrucId: string) => {
        const cauTruc = cauTrucList.find((ct) => ct.id === cauTrucId);
        if (cauTruc) {
            form.setFieldsValue({ monHocId: cauTruc.monHocId });
            setSelectedMonHoc(cauTruc.monHocId);
            setYeuCauList([...cauTruc.yeuCau]);
            message.info('Đã áp dụng cấu trúc đề');
        }
    };

    return (
        <div>
            <Card
                title='Quản lý đề thi'
                extra={
                    <Space>
                        <Button icon={<SaveOutlined />} onClick={() => setVisibleCauTruc(true)}>
                            Cấu trúc đề đã lưu ({cauTrucList.length})
                        </Button>
                        <Button
                            type='primary'
                            icon={<FileAddOutlined />}
                            onClick={() => {
                                setVisibleTaoDe(true);
                                setYeuCauList([]);
                                setSelectedMonHoc('');
                                form.resetFields();
                            }}
                        >
                            Tạo đề thi
                        </Button>
                    </Space>
                }
            >
                <Table
                    dataSource={deThiList}
                    columns={deThiColumns}
                    rowKey='id'
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: 'Chưa có đề thi nào' }}
                />
            </Card>

            <Modal
                title='Tạo đề thi'
                visible={visibleTaoDe}
                onCancel={() => {
                    setVisibleTaoDe(false);
                    form.resetFields();
                    setYeuCauList([]);
                }}
                width={700}
                footer={[
                    <Button key='cancel' onClick={() => setVisibleTaoDe(false)}>
                        Hủy
                    </Button>,
                    <Button
                        key='save-struct'
                        icon={<SaveOutlined />}
                        onClick={() => {
                            if (!selectedMonHoc) {
                                message.error('Vui lòng chọn môn học trước!');
                                return;
                            }
                            setVisibleCauTruc(true);
                        }}
                    >
                        Lưu cấu trúc
                    </Button>,
                    <Button key='submit' type='primary' icon={<ThunderboltOutlined />} onClick={handleTaoDe}>
                        Tạo đề
                    </Button>,
                ]}
                destroyOnClose
            >
                <Form form={form} layout='vertical'>
                    <Form.Item name='ten' label='Tên đề thi' rules={[{ required: true, message: 'Nhập tên đề thi' }]}>
                        <Input placeholder='VD: Đề thi giữa kỳ - Lập trình Web' />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={16}>
                            <Form.Item
                                name='monHocId'
                                label='Môn học'
                                rules={[{ required: true, message: 'Chọn môn học' }]}
                            >
                                <Select
                                    placeholder='Chọn môn học'
                                    onChange={(val) => setSelectedMonHoc(val)}
                                >
                                    {monHocList.map((m) => (
                                        <Select.Option key={m.id} value={m.id}>
                                            {m.tenMon} ({m.maMon})
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label='Áp dụng cấu trúc'>
                                <Select placeholder='Chọn cấu trúc' allowClear onChange={applyCauTruc}>
                                    {cauTrucList
                                        .filter((ct) => !selectedMonHoc || ct.monHocId === selectedMonHoc)
                                        .map((ct) => (
                                            <Select.Option key={ct.id} value={ct.id}>
                                                {ct.ten}
                                            </Select.Option>
                                        ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>

                <Divider orientation='left'>Yêu cầu câu hỏi</Divider>

                {yeuCauList.map((yc, index) => (
                    <Row key={index} gutter={8} style={{ marginBottom: 8 }} align='middle'>
                        <Col span={8}>
                            <Select
                                value={yc.mucDoKho}
                                onChange={(val) => updateYeuCau(index, 'mucDoKho', val)}
                                style={{ width: '100%' }}
                                placeholder='Mức độ khó'
                            >
                                {mucDoOptions.map((m) => (
                                    <Select.Option key={m} value={m}>
                                        <Tag color={mucDoColor[m]}>{m}</Tag>
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <Select
                                value={yc.khoiKienThucId || undefined}
                                onChange={(val) => updateYeuCau(index, 'khoiKienThucId', val)}
                                style={{ width: '100%' }}
                                placeholder='Khối kiến thức'
                            >
                                {khoiKTList.map((k) => (
                                    <Select.Option key={k.id} value={k.id}>
                                        {k.ten}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={5}>
                            <InputNumber
                                min={1}
                                value={yc.soLuong}
                                onChange={(val) => updateYeuCau(index, 'soLuong', val || 1)}
                                style={{ width: '100%' }}
                                placeholder='Số lượng'
                                addonAfter='câu'
                            />
                        </Col>
                        <Col span={3} style={{ textAlign: 'center' }}>
                            <Button
                                type='text'
                                danger
                                icon={<MinusCircleOutlined />}
                                onClick={() => removeYeuCau(index)}
                            />
                        </Col>
                    </Row>
                ))}

                <Button type='dashed' onClick={addYeuCau} block icon={<PlusOutlined />} style={{ marginTop: 8 }}>
                    Thêm yêu cầu
                </Button>
            </Modal>

            <Modal
                title='Cấu trúc đề đã lưu'
                visible={visibleCauTruc}
                onCancel={() => setVisibleCauTruc(false)}
                footer={null}
                width={600}
            >
                {visibleTaoDe && yeuCauList.length > 0 && (
                    <Card size='small' style={{ marginBottom: 16 }} title='Lưu cấu trúc hiện tại'>
                        <Form form={cauTrucForm} layout='inline' onFinish={handleLuuCauTruc}>
                            <Form.Item
                                name='tenCauTruc'
                                rules={[{ required: true, message: 'Nhập tên' }]}
                                style={{ flex: 1 }}
                            >
                                <Input placeholder='Tên cấu trúc (VD: Đề giữa kỳ)' />
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType='submit' icon={<SaveOutlined />}>
                                    Lưu
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                )}

                <List
                    dataSource={cauTrucList}
                    locale={{ emptyText: 'Chưa có cấu trúc đề nào' }}
                    renderItem={(item) => (
                        <List.Item
                            actions={[
                                <Popconfirm
                                    key='delete'
                                    title='Xóa cấu trúc này?'
                                    onConfirm={() => xoaCauTruc(item.id)}
                                >
                                    <Button danger size='small' icon={<DeleteOutlined />} />
                                </Popconfirm>,
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    <span>
                                        {item.ten} - <Text type='secondary'>{getMonHocTen(item.monHocId)}</Text>
                                    </span>
                                }
                                description={
                                    <Space wrap>
                                        {item.yeuCau.map((yc, i) => (
                                            <Tag key={i} color={mucDoColor[yc.mucDoKho]}>
                                                {yc.mucDoKho} - {getKhoiKTTen(yc.khoiKienThucId)}: {yc.soLuong} câu
                                            </Tag>
                                        ))}
                                    </Space>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>

            <Modal
                title={selectedDeThi ? `Đề thi: ${selectedDeThi.ten}` : 'Xem đề thi'}
                visible={visibleXemDe}
                onCancel={() => setVisibleXemDe(false)}
                footer={null}
                width={700}
            >
                {selectedDeThi && (
                    <div>
                        <Row gutter={16} style={{ marginBottom: 16 }}>
                            <Col span={12}>
                                <Text strong>Môn học:</Text> {getMonHocTen(selectedDeThi.monHocId)}
                            </Col>
                            <Col span={12}>
                                <Text strong>Số câu:</Text> {selectedDeThi.cauHoiIds.length} câu
                            </Col>
                        </Row>
                        <Divider />
                        <Title level={5}>Danh sách câu hỏi</Title>
                        {selectedDeThi.cauHoiIds.map((id, index) => {
                            const ch = getCauHoiById(id);
                            if (!ch) return null;
                            return (
                                <Card
                                    key={id}
                                    size='small'
                                    style={{ marginBottom: 8 }}
                                    title={
                                        <span>
                                            Câu {index + 1} ({ch.maCauHoi})
                                            <Tag color={mucDoColor[ch.mucDoKho]} style={{ marginLeft: 8 }}>
                                                {ch.mucDoKho}
                                            </Tag>
                                            <Tag>{getKhoiKTTen(ch.khoiKienThucId)}</Tag>
                                        </span>
                                    }
                                >
                                    <div style={{ whiteSpace: 'pre-wrap' }}>{ch.noiDung}</div>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default DeThiPage;
