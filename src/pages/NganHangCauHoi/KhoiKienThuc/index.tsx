import { Button, Card, Form, Input, Modal, Popconfirm, Table, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from 'umi';
import type { KhoiKienThuc } from '@/models/nganhangcauhoi.khoikienthuc';
import moment from 'moment';

const KhoiKienThucPage = () => {
    const { data, visible, setVisible, editingRecord, add, update, remove, handleEdit, handleAdd } =
        useModel('nganhangcauhoi.khoikienthuc');
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Mã',
            dataIndex: 'ma',
            width: 120,
        },
        {
            title: 'Tên khối kiến thức',
            dataIndex: 'ten',
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
            render: (record: KhoiKienThuc) => (
                <>
                    <Tooltip title='Sửa'>
                        <Button onClick={() => handleEdit(record)} type='link' icon={<EditOutlined />} />
                    </Tooltip>
                    <Tooltip title='Xóa'>
                        <Popconfirm title='Xóa khối kiến thức này?' onConfirm={() => remove(record.id)}>
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
            title='Danh mục khối kiến thức'
            extra={
                <Button type='primary' icon={<PlusOutlined />} onClick={handleAdd}>
                    Thêm mới
                </Button>
            }
        >
            <Table dataSource={data} columns={columns} rowKey='id' pagination={{ pageSize: 10 }} />

            <Modal
                title={editingRecord ? 'Sửa khối kiến thức' : 'Thêm khối kiến thức'}
                visible={visible}
                onCancel={() => {
                    setVisible(false);
                    form.resetFields();
                }}
                footer={null}
                destroyOnClose
            >
                <Form form={form} layout='vertical' onFinish={onFinish}>
                    <Form.Item name='ma' label='Mã' rules={[{ required: true, message: 'Vui lòng nhập mã' }]}>
                        <Input placeholder='VD: KKT01' />
                    </Form.Item>
                    <Form.Item
                        name='ten'
                        label='Tên khối kiến thức'
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                    >
                        <Input placeholder='VD: Tổng quan' />
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

export default KhoiKienThucPage;
