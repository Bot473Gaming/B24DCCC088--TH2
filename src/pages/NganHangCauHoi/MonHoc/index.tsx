import { Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { MonHoc } from '@/models/nganhangcauhoi.monhoc';
import moment from 'moment';

const MonHocPage = () => {
    const { data, visible, setVisible, editingRecord, add, update, remove, handleEdit, handleAdd } =
        useModel('nganhangcauhoi.monhoc');
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Mã môn',
            dataIndex: 'maMon',
            width: 120,
        },
        {
            title: 'Tên môn học',
            dataIndex: 'tenMon',
        },
        {
            title: 'Số tín chỉ',
            dataIndex: 'soTinChi',
            width: 100,
            align: 'center' as const,
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
            width: 100,
            align: 'center' as const,
            render: (record: MonHoc) => (
                <>
                    <Tooltip title='Sửa'>
                        <Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Popconfirm title='Xóa môn học này?' onConfirm={() => remove(record.id)}>
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
            title='Danh mục môn học'
            extra={
                <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm mới
                </Button>
            }
        >
            <Table dataSource={data} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

            <Modal
                title={editingRecord ? 'Sửa môn học' : 'Thêm môn học'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout='vertical' onFinish={onFinish}>
                    <Form.Item name='maMon' label='Mã môn' rules={[{ required: true, message: 'Vui lòng nhập mã môn' }]}>
                        <Input placeholder='VD: INT1234' />
                    </Form.Item>
                    <Form.Item
                        name='tenMon'
                        label='Tên môn học'
                        rules={[{ required: true, message: 'Vui lòng nhập tên môn' }]}
                    >
                        <Input placeholder='VD: Lập trình Web' />
                    </Form.Item>
                    <Form.Item
                        name='soTinChi'
                        label='Số tín chỉ'
                        rules={[{ required: true, message: 'Vui lòng nhập số tín chỉ' }]}
                    >
                        <InputNumber min={1} max={10} style={{ width: '100%' }} placeholder='VD: 3' />
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

export default MonHocPage;
