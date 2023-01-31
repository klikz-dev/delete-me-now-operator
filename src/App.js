import React, { useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import BarLoader from "react-spinners/BarLoader";

import { verifyTokenAsync } from "./actions/auth-async.action";
import MainRouter from "./routes/router";

export default function App() {
  const auth_obj = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { authLoading } = auth_obj;

  useEffect(() => {
    dispatch(verifyTokenAsync());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="vh-100 vw-100 d-flex justify-content-center">
        <BarLoader
          css="margin: auto;"
          size={100}
          color={"#3D4975"}
          loading={authLoading}
        />
      </div>
    );
  } else {
    return <MainRouter />;
  }
}
