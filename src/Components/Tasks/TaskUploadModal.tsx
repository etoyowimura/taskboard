import { Modal, Upload, Button, Space } from "antd";
import { taskController } from "../../API/LayoutApi/tasks";
// @ts-ignore
import uploadfile from "../../assets/uploadfile.png";
// @ts-ignore
import createIcon from "../../assets/galkaIcon.png";
import { CloseOutlined } from "@ant-design/icons";
import { TTask } from "../../types/Tasks/TTasks";
import { useState } from "react";
import TextArea from "antd/es/input/TextArea";

const TaskUploadModal = ({
  uploadOpen,
  recordTask,
  setUploadOpen,
}: {
  recordTask: TTask | undefined;
  uploadOpen: boolean;
  setUploadOpen(open: boolean): void;
}) => {
  const handleCancel = () => {
    setUploadOpen(!uploadOpen);
  };
  const [fileData, setFileData] = useState();
  const [text, setText] = useState<any>();
  return (
    <Modal
      open={uploadOpen}
      title="Upload file"
      okText="Upload"
      cancelText="Cancel"
      onCancel={handleCancel}
      width={720}
      footer={
        <Space>
          <Button
            onClick={handleCancel}
            style={{ display: "flex", alignItems: "center" }}
            icon={<CloseOutlined />}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const updatedValues: any = {};
              updatedValues.task_id = recordTask?.id;
              updatedValues.file = fileData;
              updatedValues.description = text;
              taskController.addTaskFile(updatedValues).then(() => {
                setUploadOpen(!uploadOpen);
              });
            }}
            icon={<img alt="" src={createIcon} />}
          >
            Upload
          </Button>
        </Space>
      }
    >
      <div>
        <Upload.Dragger
          name="file"
          multiple={true}
          customRequest={({ file, onSuccess }: any) => {
            setFileData(file);
            if (file) {
              onSuccess();
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <img src={uploadfile} alt="" />
          </p>
          <p
            className="ant-upload-text"
            style={{
              color: "rgba(15, 17, 28, 1)",
              fontWeight: 600,
              fontSize: 14,
              lineHeight: "20px",
              letterSpacing: "-1%",
            }}
          >
            Drag and drop files or{" "}
            <span style={{ color: "rgba(249, 158, 44, 1)" }}>
              Click to select
            </span>
            <br />
            <span
              style={{
                color: "rgba(155, 157, 170, 1)",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: "15.73px",
                letterSpacing: "-2%",
              }}
            >
              Maximum file size is 10 MB
            </span>
          </p>
        </Upload.Dragger>
        <TextArea
          style={{ padding: "7px 11px", marginTop: 20 }}
          placeholder="Description"
          autoSize={{ minRows: 3, maxRows: 3 }}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default TaskUploadModal;
