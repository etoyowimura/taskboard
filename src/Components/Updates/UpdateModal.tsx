// // @ts-ignore
// import closeIcon from "../../assets/closeIcon.png";
// // @ts-ignore
// import editIcon from "../../assets/editIcon.png";
// // @ts-ignore
// import deleteIcon from "../../assets/deleteIconRed.png";
// // @ts-ignore
// import attachmentIcon from "../../assets/attachmentIcon.png";
// // @ts-ignore
// import infoIcon from "../../assets/infoIcon.png";
// // @ts-ignore
// import uploadIcon from "../../assets/uploadIcon.png";
// import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
// import { TUpdate } from "../../types/Update/TUpdate";

// const UpdateModal = ({
//   modalOpen,
//   setModalOpen,
//   recordUpdate,
// }: {
//   recordUpdate: TUpdate | undefined;
//   modalOpen: any;
//   setModalOpen: any;
// }) => {
//   const handleCancel = () => {
//     setModalOpen(!modalOpen);
//   };

//   return (
//     <div className="TaskModal">
//       <div className="TaskModal-header">
//         <div className="TaskModal-title">
//           <p className="p-driver">{recordUpdate?.company}</p>
//           <p
//             style={{ marginLeft: 12 }}
//             className={`status-${recordUpdate?.status}`}
//           >
//             {recordUpdate?.status}
//           </p>
//         </div>
//         <div className="mdoal-actions">
//           <button className="btn-modal-action">
//             <img src={editIcon} alt="" />
//             Edit
//           </button>
//           <button style={{ marginLeft: 12 }} className="btn-modal-action">
//             <img src={uploadIcon} alt="" />
//             Upload file
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
//         <Tabs>
//           <TabPane
//             tab={
//               <span style={{ display: "flex", alignItems: "center" }}>
//                 <img style={{ marginRight: 10 }} src={infoIcon} alt="" />
//                 Information
//               </span>
//             }
//             key="1"
//           >
//             <div className="info-div">
//               <p
//                 style={{
//                   fontSize: 18,
//                   fontWeight: 700,
//                   lineHeight: "24px",
//                   letterSpacing: "-0.02em",
//                   marginBottom: 16,
//                 }}
//               >
//                 Information
//               </p>
//               <div className="info-body">
//                 <tr>
//                   <p className="sub">Comapany</p>
//                   <p className="info">{recordUpdate?.company}</p>
//                 </tr>
//                 <tr>
//                   <p className="sub">Driver</p>
//                   <p className="info">{recordUpdate?.customer}</p>
//                 </tr>
//                 <tr>
//                   <p className="sub">Created by</p>
//                   <p className="info">{recordUpdate?.provider}</p>
//                 </tr>
//                 <tr>
//                   <p className="sub">Created at</p>
//                   <p className="info">{recordUpdate?.created_at}</p>
//                 </tr>
//                 <tr>
//                   <p className="sub">Completed_by</p>
//                   <p className="info">{recordUpdate?.executor}</p>
//                 </tr>
//                 <tr>
//                   <p className="sub">Solution</p>
//                   <p className="info">{recordUpdate?.solution}</p>
//                 </tr>
//                 <tr>
//                   <p className="sub">Note</p>
//                   <p className="info">{recordUpdate?.note}</p>
//                 </tr>
//               </div>
//             </div>
//           </TabPane>
//           <TabPane
//             tab={
//               <span style={{ display: "flex", alignItems: "center" }}>
//                 <img style={{ marginRight: 10 }} src={attachmentIcon} alt="" />
//                 Attachments
//               </span>
//             }
//             key="2"
//           ></TabPane>
//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default UpdateModal;
import React from "react";

const UpdateModal = () => {
  return <div>UpdateModal</div>;
};

export default UpdateModal;
