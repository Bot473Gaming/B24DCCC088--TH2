import {
    Button,
    Card,
    Col,
    Form,
    Input,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table,
    Tag,
    Tooltip,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { CauHoi, MucDoKho } from '@/models/nganhangcauhoi.cauhoi';
import moment from 'moment';

const { TextArea } = Input;

const mucDoOptions: MucDoKho[] = ['Dễ', 'Trung bình', 'Khó', 'Rất khó'];

const mucDoColor: Record<MucDoKho, string> = {
    'Dễ': 'green',
    'Trung bình': 'blue',
    'Khó': 'orange',
    'Rất khó': 'red',
};

const CauHoiPage = () => {
    const {
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
    } = useModel('nganhangcauhoi.cauhoi');
    const { data: monHocList } = useModel('nganhangcauhoi.monhoc');
    const { data: khoiKTList } = useModel('nganhangcauhoi.khoikienthuc');
    const [form] = Form.useForm();

    const getMonHocTen = (id: string) => monHocList.find((m) => m.id === id)?.tenMon || id;
    const getKhoiKTTen = (id: string) => khoiKTList.find((k) => k.id === id)?.ten || id;

    const columns = [
        {
            title: 'Mã câu hỏi',
            dataIndex: 'maCauHoi',
            width: 120,
        },
        {
            title: 'Môn học',
            dataIndex: 'monHocId',
            width: 150,
            render: (val: string) => getMonHocTen(val),
        },
        {
            title: 'Nội dung',
            dataIndex: 'noiDung',
            ellipsis: true,
        },
        {
            title: 'Mức độ khó',
            dataIndex: 'mucDoKho',
            width: 120,
            align: 'center' as const,
            render: (val: MucDoKho) => <Tag color={mucDoColor[val]}>{val}</Tag>,
        },
        {
            title: 'Khối kiến thức',
            dataIndex: 'khoiKienThucId',
            width: 150,
            render: (val: string) => getKhoiKTTen(val),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 150,
            align: 'center' as const,
            render: (val: string) => moment(val).format('HH:mm DD/MM/YYYY'),
        },
        {
            title: 'Thao tác',
            width: 100,
            align: 'center' as const,
            render: (record: CauHoi) => (
                <>
                    <Tooltip title='Sửa'>
                        <Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Popconfirm title='Xóa câu hỏi này?' onConfirm={() => remove(record.id)}>
                            <Button danger type='link' icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </>
            ),
        },
    ];

    const onFinish = (values: any) => {
        if (editingRecord) {
            update(editingRecord.id, values);
        } else {
            add(values);
        }
        setVisible(false);
        form.resetFields();
    };

    return (
        <Card
            title='Quản lý câu hỏi'
            extra={
                <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm câu hỏi
                </Button>
            }
        >
            <Card size='small' style={{ marginBottom: 16 }} title={<><SearchOutlined /> Bộ lọc</>}>
                <Row gutter={16}>
                    <Col span={8}>
                        <Select
                            placeholder='Lọc theo môn học'
                            allowClear
                            style={{ width: '100%' }}
                            value={filters.monHocId}
                            onChange={(val) => setFilters({ ...filters, monHocId: val })}
                        >
                            {monHocList.map((m: any) => (
                                <Select.Option key={m.id} value={m.id}>
                                    {m.tenMon}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select
                            placeholder='Lọc theo mức độ khó'
                            allowClear
                            style={{ width: '100%' }}
                            value={filters.mucDoKho}
                            onChange={(val) => setFilters({ ...filters, mucDoKho: val })}
                        >
                            {mucDoOptions.map((m: any) => (
                                <Select.Option key={m} value={m}>
                                    {m}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}>
                        <Select
                            placeholder='Lọc theo khối kiến thức'
                            allowClear
                            style={{ width: '100%' }}
                            value={filters.khoiKienThucId}
                            onChange={(val) => setFilters({ ...filters, khoiKienThucId: val })}
                        >
                            {khoiKTList.map((k: any) => (
                                <Select.Option key={k.id} value={k.id}>
                                    {k.ten}
                                </Select.Option>
                            ))}
                        </Select>
                    </Col>
                </Row>
            </Card>

            <Table dataSource={filteredData} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

            <Modal
                title={editingRecord ? 'Sửa câu hỏi' : 'Thêm câu hỏi'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
                width={600}
            >
                <Form form={form} layout='vertical' onFinish={onFinish}>
                    <Form.Item
                        name='maCauHoi'
                        label='Mã câu hỏi'
                        rules={[{ required: true, message: 'Vui lòng nhập mã câu hỏi' }]}
                    >
                        <Input placeholder='VD: CH001' />
                    </Form.Item>
                    <Form.Item
                        name='monHocId'
                        label='Môn học'
                        rules={[{ required: true, message: 'Vui lòng chọn môn học' }]}
                    >
                        <Select placeholder='Chọn môn học'>
                            {monHocList.map((m) => (
                                <Select.Option key={m.id} value={m.id}>
                                    {m.tenMon} ({m.maMon})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='khoiKienThucId'
                        label='Khối kiến thức'
                        rules={[{ required: true, message: 'Vui lòng chọn khối kiến thức' }]}
                    >
                        <Select placeholder='Chọn khối kiến thức'>
                            {khoiKTList.map((k) => (
                                <Select.Option key={k.id} value={k.id}>
                                    {k.ten} ({k.ma})
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='mucDoKho'
                        label='Mức độ khó'
                        rules={[{ required: true, message: 'Vui lòng chọn mức độ khó' }]}
                    >
                        <Select placeholder='Chọn mức độ khó'>
                            {mucDoOptions.map((m) => (
                                <Select.Option key={m} value={m}>
                                    {m}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name='noiDung'
                        label='Nội dung câu hỏi'
                        rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                    >
                        <TextArea rows={4} placeholder='Nhập nội dung câu hỏi tự luận...' />
                    </Form.Item>
                    <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                        <Button type='primary' htmlType='submit'>
                            {editingRecord ? 'Cập nhật' : 'Thêm'}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    );
};

export default CauHoiPage;
