import { TTask } from "../../types/Tasks/TTasks";
import { Modal } from "antd";
import TaskTable from "./TaskTable";

const ErrorUncompletedTasksModal = ({
  errorModal,
  setErrorModal,
  uncomletedData,
}: {
  uncomletedData: TTask[] | undefined;
  errorModal: boolean;
  setErrorModal: any;
}) => {
  const handleCancel = () => {
    setErrorModal(!errorModal);
  };
  return (
    <Modal
      onCancel={handleCancel}
      footer={null}
      open={errorModal}
      width={1400}
      maskClosable={true}
    >
      <div className="uncomleted-tasks-modal">
        <p
          className="p-driver"
          style={{ textAlign: "center", marginBottom: 10, color: "red" }}
        >
          You have unfinished tasks. You cannot assign another one until they
          are completed.
        </p>
        <TaskTable
          data={{ characters: uncomletedData }}
          showTaskModal={false}
          showErrorModal={false}
          isLoading={false}
          setErrorModal={setErrorModal}
        />
      </div>
    </Modal>
  );
};

export default ErrorUncompletedTasksModal;
