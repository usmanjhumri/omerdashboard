import React, { useEffect, useState } from "react";
// import { authSelector } from "../../store/selectors/index";
// import { useSelector } from "react-redux";
import { message } from "antd";
import SideBar from "../sidebar/sideBar";
import Header from "../header/header";
import { registerUser } from "../../api/endpoints/user.js";

const Register = () => {
  //   const { user, access_token } = useSelector(authSelector);
  const [fieldsShow, setFieldsShow] = useState(false);
  const [type, setType] = useState("ADD");
  const [state, setState] = useState({
    id: "",
    userName: "",
    userEmail: "",
    userSiteId: "",
    password: "",
    reTypePassword: "",
    grpId: "",
    companyCode: "",
  });

  const clearState = () => {
    setState({
      id: "",
      userName: "",
      userEmail: "",
      userSiteId: "",
      password: "",
      reTypePassword: "",
    });
  };

  const onChangeText = (e, object) => {
    if (object) {
      const { name, value } = object;
      setState({
        ...state,
        [name]: value,
      });
    } else {
      const { name, value } = e.target;
      setState({
        ...state,
        [name]: value,
      });
    }
  };
  const addUser = async () => {
    setType("SAVE");
    setFieldsShow(true);
  };
  const saveUser = async (e) => {
    if (
      !state.userName ||
      !state.userEmail ||
      !state.password ||
      !state.userSiteId ||
      !state.companyCode ||
      !state.grpId ||
      state.password !== state.reTypePassword ||
      state.password.length < 8
    ) {
      return message.error(
        `Please type ${
          !state.userName
            ? "User Name"
            : !state.userEmail
            ? "User Email"
            : !state.password
            ? "User Password"
            : !state.userSiteId
            ? "User Site Id"
            : !state.companyCode
            ? "User Company Code"
            : !state.grpId
            ? "User Group Id"
            : state.password !== state.reTypePassword
            ? "Same Passwords in both fields"
            : state.password.length < 8
            ? "Password greater than 8 charactors"
            : ""
        }`
      );
    }
    const payload = {
      name: state.userName,
      email: state.userEmail,
      siteId: Number(state.userSiteId),
      grpId: Number(state.grpId),
      companyCode: Number(state.companyCode),
      password: state.password,
    };

    console.log(payload, "payload");

    const results = await registerUser(payload);
    if (results.success) {
      message.success(results.message || "Successfully Created!");
      clearState();
      setFieldsShow(false);
      setType("ADD");
    } else {
      message.error(results.message);
    }
  };

  //   const confirmDeleteNozel = async () => {
  //     const data = {
  //       id: state.id,
  //       nozelNumber: state.nozelNumber,
  //       tankNumber: state.tankNumber,
  //       nozelOrder: Number(state.nozelOrder),
  //       closed: Number(state.closed),
  //     };
  //     const results = await deleteSingleNozel(data, access_token);
  //     if (results.success) {
  //       message.success(results.message || "Deleted Successfully!");
  //       clearState();
  //       setFieldsShow(false);
  //       setType("ADD");
  //     } else {
  //       message.error(results.message);
  //     }
  //   };

  //   const [modal, contextHolder] = Modal.useModal();
  //   const deleteNozel = async () => {
  //     setType("DELETE");
  //     setFieldsShow(true);
  //     const _nozels = await getAllNozel(access_token);
  //     if (_nozels.success) {
  //       setState({
  //         ...state,
  //         nozels: _nozels.data,
  //       });
  //     }
  //   };
  //   const confirmDelete = () => {
  //     modal.confirm({
  //       title: `Confirm`,
  //       content: "You want to delete Nozel?",
  //       okText: "Yes",
  //       cancelText: "Cancel",
  //       onOk: deleteNozel,
  //     });
  //   };

  useEffect(() => {
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearStates = () => {
    clearState();
    setFieldsShow(false);
    setType("ADD");
  };
  return (
    <>
      <div className="flex  bg-black main">
        {/* <SideBar /> */}
        <div className="h-full  flex flex-col content-center  w-full">
          {/* <Header /> */}
          <div className="flex justify-center">
            <div className="meterTableMain flex flex-col justify-items-center justify-center w-1/2 ml-10 mt-5 mr-10">
              <div className="bg-blue-500 headingBox flex justify-center">
                <h1 className=" text-white">Add User</h1>
              </div>
              <div className="flex flex-col p-2 content-center items-center justify-items-center justify-evenly">
                {fieldsShow && (
                  <div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Name:
                      </label>
                      <input
                        type="text"
                        name="userName"
                        value={state.userName}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Site Id:
                      </label>
                      <input
                        type="number"
                        name="userSiteId"
                        value={state.userSiteId}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Group Id:
                      </label>
                      <input
                        type="number"
                        name="grpId"
                        value={state.grpId}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div className="">
                      <label className="text-white" for="fname">
                        Company Code:
                      </label>
                      <input
                        type="number"
                        name="companyCode"
                        value={state.companyCode}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Email:
                      </label>
                      <input
                        type="email"
                        placeholder="Email"
                        name="userEmail"
                        required
                        value={state.userEmail}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Password:
                      </label>
                      <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        required
                        value={state.password}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                    <div>
                      <label className="text-white" for="fname">
                        Password:
                      </label>
                      <input
                        type="password"
                        placeholder="ReType Password"
                        name="reTypePassword"
                        required
                        value={state.reTypePassword}
                        onChange={onChangeText}
                        className="text-black inpTxt p-2 h-8 ml-3 mb-3"
                      />
                    </div>
                  </div>
                )}

                <div>
                  {type === "ADD" && (
                    <button
                      onClick={addUser}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      Add
                    </button>
                  )}

                  {type === "SAVE" && (
                    <button
                      onClick={saveUser}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 py-1 px-4 rounded"
                    >
                      Save
                    </button>
                  )}
                  {/* <button
                        className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                      >
                        Add
                      </button> */}
                  {type === "ADD" && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white ml-2 mt-3 py-1 px-4 rounded">
                      View
                    </button>
                  )}
                  {type === "ADD" && (
                    <button
                      //   onClick={editNozel}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Edit
                    </button>
                  )}

                  {(type === "EDIT" || type === "DELETE") && (
                    <button
                      //   onClick={saveEditNozel}
                      className="bg-blue-500 hover:bg-blue-700 text-white ml-2 mt-3 py-1 px-4 rounded"
                    >
                      DONE
                    </button>
                  )}
                  {type === "ADD" && (
                    <button
                      //   onClick={confirmDelete}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Delete
                    </button>
                  )}
                  {type !== "ADD" && (
                    <button
                      onClick={clearStates}
                      className="bg-blue-500 hover:bg-blue-700 text-white mt-3 ml-3 py-1 px-4 rounded"
                    >
                      Exit
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
