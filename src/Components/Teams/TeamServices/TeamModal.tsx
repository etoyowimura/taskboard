// // @ts-ignore
// import closeIcon from "../../assets/closeIcon.png";
// // @ts-ignore
// import editIcon from "../../assets/editIcon.png";
// // @ts-ignore
// import deleteIcon from "../../assets/deleteIconRed.png";
// import { TTeam } from "../../types/Team/TTeam";
// import { Table } from "antd";
// // @ts-ignore
// import tagIcon from "../../assets/tagIcon.png";
// import { useUserByTeam } from "../../Hooks/Users";

// const TeamModal = ({
//   modalOpen,
//   setModalOpen,
//   recordTeam,
// }: {
//   recordTeam: TTeam | undefined;
//   modalOpen: any;
//   setModalOpen: any;
// }) => {
//   const handleCancel = () => {
//     setModalOpen(!modalOpen);
//   };

//   const { data, isLoading, refetch } = useUserByTeam(recordTeam?.uuid);

//   return (
//     <div className="TaskModal">
//       <div className="TaskModal-header">
//         <div className="TaskModal-title">
//           <p className="p-driver">{recordTeam?.name}</p>
//         </div>
//         <div className="mdoal-actions">
//           <button className="btn-modal-action">
//             <img src={editIcon} alt="" />
//             Edit
//           </button>
//           <button style={{ marginLeft: 12 }} className="btn-modal-action">
//             <img src={deleteIcon} alt="" />
//             Delete
//           </button>
//           <button
//             onClick={handleCancel}
//             style={{ marginLeft: 20 }}
//             className="btn-modal-action"
//           >
//             <img style={{ margin: 2 }} src={closeIcon} alt="" />
//           </button>
//         </div>
//       </div>
//       <div className="TaskModal-content">
//         <p
//           style={{
//             fontSize: 18,
//             fontWeight: 700,
//             lineHeight: "24px",
//             letterSpacing: "-0.02em",
//             marginLeft: 24
//           }}
//         >
//           Users
//         </p>
//         <div className="users-table-by-team">
//           <Table
//             loading={isLoading}
//             rowClassName={(record, index) =>
//               index % 2 === 0 ? "even-row" : "odd-row"
//             }
//             dataSource={data?.map((u, i) => {
//               return {
//                 ...u,
//                 no: i + 1,
//                 key: u?.uid,
//               };
//             })}
//             columns={[
//               {
//                 title: <img src={tagIcon} alt="" />,
//                 dataIndex: "no",
//                 width: "5%",
//               },
//               {
//                 title: "Name",
//                 dataIndex: "full_name",
//               },
//               {
//                 title: "Username",
//                 dataIndex: "username",
//               },
//               {
//                 title: "Actions",
//                 dataIndex: "actions",
//               },
//             ]}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TeamModal;
import React from 'react'

const TeamModal = () => {
  return (
    <div>TeamModal</div>
  )
}

export default TeamModal